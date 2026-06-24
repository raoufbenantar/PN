import re

import bleach
from rest_framework import serializers

from .models import Inquiry

# Allowed tags: none — we strip all HTML from text fields.
BLEACH_TAGS = []
BLEACH_ATTRIBUTES = {}
BLEACH_STRIP = True


def sanitize_text(value: str) -> str:
    """Strip all HTML/scripts and trim whitespace."""
    cleaned = bleach.clean(value, tags=BLEACH_TAGS, attributes=BLEACH_ATTRIBUTES, strip=BLEACH_STRIP)
    return cleaned.strip()


class InquirySerializer(serializers.ModelSerializer):
    expedition_title = serializers.CharField(source='expedition.title', read_only=True)

    class Meta:
        model = Inquiry
        fields = [
            'id', 'name', 'phone', 'email', 'message',
            'expedition', 'expedition_title', 'status',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['status', 'created_at', 'updated_at']

    def validate_name(self, value):
        """Remove HTML, enforce minimum length."""
        cleaned = sanitize_text(value)
        if len(cleaned) < 2:
            raise serializers.ValidationError(
                'Name must be at least 2 characters long.'
            )
        return cleaned

    def validate_phone(self, value):
        """Validate Algerian phone number: exactly 10 digits, must start with 0."""
        cleaned = value.replace(' ', '').replace('-', '').replace('.', '')

        if not cleaned.isdigit():
            raise serializers.ValidationError(
                'Phone number must contain only digits, spaces, dashes, or dots.'
            )

        if len(cleaned) != 10:
            raise serializers.ValidationError(
                'Phone number must contain exactly 10 digits.'
            )

        if not cleaned.startswith('0'):
            raise serializers.ValidationError(
                'Phone number must begin with 0.'
            )

        return cleaned

    def validate_email(self, value):
        """Additional email validation beyond Django's EmailField."""
        cleaned = sanitize_text(value)

        # Length check
        if len(cleaned) > 254:
            raise serializers.ValidationError(
                'Email address is too long (max 254 characters).'
            )

        # Basic format double-check
        if not re.match(r'^[^@\s]+@[^@\s]+\.[^@\s]+$', cleaned):
            raise serializers.ValidationError(
                'Enter a valid email address.'
            )

        return cleaned

    def validate_message(self, value):
        """Strip all HTML/script tags to prevent stored XSS."""
        cleaned = sanitize_text(value)

        if len(cleaned) < 5:
            raise serializers.ValidationError(
                'Message must be at least 5 characters long.'
            )

        if len(cleaned) > 5000:
            raise serializers.ValidationError(
                'Message is too long (max 5000 characters).'
            )

        return cleaned
