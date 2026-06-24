from django.db import models

from .validators import (
    cover_image_upload_to,
    gallery_image_upload_to,
    validate_cover_size,
    validate_gallery_size,
    validate_image_extension,
)


class Expedition(models.Model):
    CATEGORY_CHOICES = [
        ('expedition', 'Expédition'),
        ('trekking', 'Trekking'),
        ('bivouac', 'Bivouac'),
        ('camping', 'Camping'),
        ('photography', 'Photography'),
        ('wildlife', 'Wildlife'),
        ('cultural', 'Cultural'),
    ]

    DIFFICULTY_CHOICES = [
        ('easy', 'Easy'),
        ('moderate', 'Moderate'),
        ('difficult', 'Difficult'),
        ('expert', 'Expert'),
    ]

    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True)
    description = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES)
    duration_days = models.PositiveIntegerField()
    price_dzd = models.DecimalField(max_digits=10, decimal_places=2)
    location = models.CharField(max_length=255)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    start_date = models.DateField(blank=True, null=True)
    cover_image = models.ImageField(
        upload_to=cover_image_upload_to,
        validators=[validate_image_extension, validate_cover_size],
        blank=True, null=True,
    )
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class ExpeditionImage(models.Model):
    expedition = models.ForeignKey(
        Expedition,
        related_name='images',
        on_delete=models.CASCADE,
    )
    image = models.ImageField(
        upload_to=gallery_image_upload_to,
        validators=[validate_image_extension, validate_gallery_size],
    )
    caption = models.CharField(max_length=255, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"Image for {self.expedition.title}"
