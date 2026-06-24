import re
import uuid

from rest_framework import serializers

from .models import Expedition, ExpeditionImage


class ExpeditionImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExpeditionImage
        fields = ['id', 'image', 'caption', 'order']


class ExpeditionListSerializer(serializers.ModelSerializer):
    """Compact serializer for list/index views."""
    cover_image = serializers.ImageField(read_only=True)

    class Meta:
        model = Expedition
        fields = [
            'id', 'title', 'slug', 'category', 'difficulty',
            'duration_days', 'price_dzd', 'location',
            'start_date', 'cover_image', 'is_published',
            'created_at',
        ]


class ExpeditionDetailSerializer(serializers.ModelSerializer):
    """Full serializer with nested gallery images for detail/retrieve."""
    images = ExpeditionImageSerializer(many=True, read_only=True)
    cover_image = serializers.ImageField(read_only=True)

    class Meta:
        model = Expedition
        fields = [
            'id', 'title', 'slug', 'description', 'category',
            'difficulty', 'duration_days', 'price_dzd', 'location',
            'latitude', 'longitude', 'start_date', 'cover_image',
            'is_published', 'images', 'created_at', 'updated_at',
        ]


class ExpeditionCreateSerializer(serializers.ModelSerializer):
    """Writable serializer for creating new expeditions (admin only)."""
    cover_image = serializers.ImageField(required=False)

    class Meta:
        model = Expedition
        fields = [
            'id', 'title', 'slug', 'description', 'category', 'difficulty',
            'duration_days', 'price_dzd', 'location', 'start_date',
            'cover_image', 'is_published', 'created_at',
        ]
        read_only_fields = ['id', 'slug', 'created_at']

    def validate_title(self, value):
        if Expedition.objects.filter(title=value).exists():
            raise serializers.ValidationError("An expedition with this title already exists.")
        return value

    def create(self, validated_data):
        # Auto-generate slug from title
        slug = re.sub(r'[^a-z0-9]+', '-', validated_data['title'].lower()).strip('-')
        if Expedition.objects.filter(slug=slug).exists():
            slug = f"{slug}-{uuid.uuid4().hex[:6]}"
        validated_data['slug'] = slug
        return super().create(validated_data)
