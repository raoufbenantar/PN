from django.contrib import admin

from .models import Expedition, ExpeditionImage


class ExpeditionImageInline(admin.TabularInline):
    model = ExpeditionImage
    extra = 1
    fields = ('image', 'caption', 'order')


@admin.register(Expedition)
class ExpeditionAdmin(admin.ModelAdmin):
    list_display = (
        'title', 'category', 'difficulty', 'duration_days',
        'price_dzd', 'location', 'is_published', 'created_at',
    )
    list_filter = ('category', 'difficulty', 'is_published')
    search_fields = ('title', 'description', 'location')
    prepopulated_fields = {'slug': ('title',)}
    inlines = [ExpeditionImageInline]
