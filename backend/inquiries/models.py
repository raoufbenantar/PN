from django.db import models

from .validators import selfie_upload_to, validate_image_extension, validate_selfie_size


class Inquiry(models.Model):
    STATUS_CHOICES = [
        ('new', 'New'),
        ('contacted', 'Contacted'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
    ]

    name = models.CharField(max_length=200)
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    message = models.TextField()
    expedition = models.ForeignKey(
        'expeditions.Expedition',
        related_name='inquiries',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    selfie = models.ImageField(
        upload_to=selfie_upload_to,
        validators=[validate_image_extension, validate_selfie_size],
        null=True,
        blank=False,
        help_text='A single selfie photo of the participant (max 5 MB).',
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'Inquiries'

    def __str__(self):
        return f"Inquiry from {self.name} - {self.expedition}"
