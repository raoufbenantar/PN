from django.db import models

from .validators import (
    product_cover_upload_to,
    product_gallery_upload_to,
    validate_cover_size,
    validate_gallery_size,
    validate_image_extension,
)


class Product(models.Model):
    CATEGORY_CHOICES = [
        ('t-shirt', 'T-Shirt'),
        ('hoodie', 'Hoodie'),
        ('cap', 'Cap'),
    ]

    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)  # DZD
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    cover_image = models.ImageField(
        upload_to=product_cover_upload_to,
        validators=[validate_image_extension, validate_cover_size],
        blank=True, null=True,
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'Products'

    def __str__(self):
        return self.name


class ProductImage(models.Model):
    product = models.ForeignKey(
        Product,
        related_name='images',
        on_delete=models.CASCADE,
    )
    image = models.ImageField(
        upload_to=product_gallery_upload_to,
        validators=[validate_image_extension, validate_gallery_size],
    )
    caption = models.CharField(max_length=255, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"Image for {self.product.name}"


class ProductVariant(models.Model):
    SIZE_CHOICES = [
        ('xs', 'XS'),
        ('s', 'S'),
        ('m', 'M'),
        ('l', 'L'),
        ('xl', 'XL'),
        ('xxl', 'XXL'),
    ]

    product = models.ForeignKey(
        Product,
        related_name='variants',
        on_delete=models.CASCADE,
    )
    size = models.CharField(max_length=5, choices=SIZE_CHOICES)
    color = models.CharField(max_length=50)
    stock = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['size', 'color']
        constraints = [
            # Unique (product, size, color) — the modern form of unique_together.
            models.UniqueConstraint(
                fields=['product', 'size', 'color'],
                name='uniq_product_variant',
            ),
        ]

    def __str__(self):
        return f"{self.product.name} — {self.size} / {self.color}"


class Order(models.Model):
    STATUS_CHOICES = [
        ('new', 'New'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
    ]

    full_name = models.CharField(max_length=200)
    phone_number = models.CharField(max_length=20)
    delivery_address = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    # Idempotency guard: set True the first time an order is cancelled so stock
    # is restored exactly once, even if the admin re-saves the already-cancelled
    # order (prevents double-restock).
    stock_restored = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'Orders'

    def __str__(self):
        return f"Order #{self.pk} — {self.full_name}"


class OrderItem(models.Model):
    order = models.ForeignKey(
        Order,
        related_name='items',
        on_delete=models.CASCADE,
    )
    # PROTECT keeps order history intact — a variant that has been ordered
    # cannot be deleted (flags the stock/audit decision for review).
    variant = models.ForeignKey(
        ProductVariant,
        related_name='order_items',
        on_delete=models.PROTECT,
    )
    quantity = models.PositiveIntegerField()
    # Snapshot of the variant's product price at order creation time, so later
    # price changes never affect existing orders.
    unit_price_snapshot = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.variant} x{self.quantity} (order #{self.order_id})"
