from django.contrib import admin
from django.utils.html import format_html

from .models import Inquiry


@admin.register(Inquiry)
class InquiryAdmin(admin.ModelAdmin):
    list_display = ('name', 'selfie_thumbnail', 'phone', 'email', 'expedition', 'status', 'created_at')
    list_filter = ('status', 'expedition', 'created_at')
    search_fields = ('name', 'email', 'phone', 'message')
    readonly_fields = ('selfie_thumbnail',)

    @admin.display(description='Selfie')
    def selfie_thumbnail(self, obj):
        if obj.selfie:
            return format_html(
                '<img src="{}" style="width:48px;height:48px;object-fit:cover;border-radius:4px;" />',
                obj.selfie.url,
            )
        return '-'
