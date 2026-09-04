import uuid

from django.db import transaction
from django.db.models import F
from django.utils.text import slugify
from rest_framework import serializers

from .models import Order, OrderItem, Product, ProductImage, ProductVariant

# ── Product catalogue serializers ──────────────────────────────────


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'product', 'image', 'caption', 'order']


class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = ['id', 'product', 'size', 'color', 'stock']


class ProductSerializer(serializers.ModelSerializer):
    """Public read — nested images + variants."""
    cover_image = serializers.ImageField(read_only=True)
    cover_image_url = serializers.SerializerMethodField()
    images = ProductImageSerializer(many=True, read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'description', 'price', 'category',
            'cover_image', 'cover_image_url', 'is_active', 'images', 'variants',
            'created_at', 'updated_at',
        ]

    def get_cover_image_url(self, obj):
        if not obj.cover_image:
            return None
        request = self.context.get('request')
        url = obj.cover_image.url
        return request.build_absolute_uri(url) if request and url.startswith('/') else url


class ProductWriteSerializer(serializers.ModelSerializer):
    """Admin write — slug auto-generated (mirrors ExpeditionCreateSerializer)."""
    cover_image = serializers.ImageField(required=False)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'description', 'price', 'category',
            'cover_image', 'is_active', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at']

    def create(self, validated_data):
        slug = slugify(validated_data['name'])
        if Product.objects.filter(slug=slug).exists():
            slug = f"{slug}-{uuid.uuid4().hex[:6]}"
        validated_data['slug'] = slug
        return super().create(validated_data)


# ── Order serializers ──────────────────────────────────────────────


class OrderItemInputSerializer(serializers.Serializer):
    """One requested line: {variant_id, quantity}."""
    variant_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)


class OrderCreateSerializer(serializers.ModelSerializer):
    items = OrderItemInputSerializer(many=True, write_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'full_name', 'phone_number', 'delivery_address',
            'items', 'status', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'status', 'created_at', 'updated_at']

    def validate_phone_number(self, value):
        cleaned = value.replace(' ', '').replace('-', '').replace('.', '')
        if not cleaned.isdigit():
            raise serializers.ValidationError(
                'Phone number must contain only digits, spaces, dashes, or dots.'
            )
        if len(cleaned) != 10 or not cleaned.startswith('0'):
            raise serializers.ValidationError(
                'Phone number must be a valid 10-digit Algerian number (starting with 0).'
            )
        return cleaned

    def validate(self, attrs):
        items = attrs.get('items', [])
        if not items:
            raise serializers.ValidationError({'items': 'At least one item is required.'})

        ids = [item['variant_id'] for item in items]
        if len(ids) != len(set(ids)):
            raise serializers.ValidationError({'items': 'Duplicate variant in cart.'})

        # Friendly pre-check (authoritative check happens in create() under a lock).
        variants = {
            v.id: v
            for v in ProductVariant.objects.filter(pk__in=ids).select_related('product')
        }
        for item in items:
            variant = variants.get(item['variant_id'])
            if variant is None:
                raise serializers.ValidationError(
                    {'items': f"Variant {item['variant_id']} does not exist."}
                )
            if item['quantity'] > variant.stock:
                raise serializers.ValidationError(
                    {'items': f"Only {variant.stock} left for {variant}."}
                )
        return attrs

    def create(self, validated_data):
        items_data = validated_data.pop('items')

        with transaction.atomic():
            ids = [item['variant_id'] for item in items_data]
            # Lock the variant rows so concurrent orders cannot oversell.
            locked = {
                v.id: v
                for v in ProductVariant.objects
                .select_for_update()
                .filter(pk__in=ids)
                .select_related('product')
            }

            # Authoritative stock check under the lock.
            for item in items_data:
                variant = locked[item['variant_id']]
                if item['quantity'] > variant.stock:
                    raise serializers.ValidationError(
                        {'items': f"Only {variant.stock} left for {variant}."}
                    )

            order = Order.objects.create(
                full_name=validated_data['full_name'],
                phone_number=validated_data['phone_number'],
                delivery_address=validated_data['delivery_address'],
            )

            for item in items_data:
                variant = locked[item['variant_id']]
                OrderItem.objects.create(
                    order=order,
                    variant=variant,
                    quantity=item['quantity'],
                    unit_price_snapshot=variant.product.price,
                )
                ProductVariant.objects.filter(pk=variant.id).update(
                    stock=F('stock') - item['quantity']
                )

        return order


class OrderItemReadSerializer(serializers.ModelSerializer):
    variant_id = serializers.IntegerField(source='variant.id', read_only=True)
    size = serializers.CharField(source='variant.size', read_only=True)
    color = serializers.CharField(source='variant.color', read_only=True)
    product_name = serializers.CharField(source='variant.product.name', read_only=True)
    line_total = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = [
            'id', 'variant', 'variant_id', 'size', 'color', 'product_name',
            'quantity', 'unit_price_snapshot', 'line_total',
        ]

    def get_line_total(self, obj):
        return obj.quantity * obj.unit_price_snapshot


class OrderSerializer(serializers.ModelSerializer):
    """Read/write for admins. status is writable (confirm/cancel)."""
    items = OrderItemReadSerializer(many=True, read_only=True)
    total = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            'id', 'full_name', 'phone_number', 'delivery_address', 'status',
            'items', 'total', 'stock_restored', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'items', 'total', 'stock_restored', 'created_at', 'updated_at']

    def get_total(self, obj):
        return sum(item.quantity * item.unit_price_snapshot for item in obj.items.all())
