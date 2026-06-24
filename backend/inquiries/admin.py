from django.contrib import admin

from .models import Inquiry


@admin.register(Inquiry)
class InquiryAdmin(admin.ModelAdmin):
    list_display = ('name', 'phone', 'email', 'expedition', 'status', 'created_at')
    list_filter = ('status', 'expedition', 'created_at')
    search_fields = ('name', 'email', 'phone', 'message')
