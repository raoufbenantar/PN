import io
import os

from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand
from django.utils.text import slugify
from PIL import Image

from expeditions.models import Expedition, ExpeditionImage

# ── Seed data ──────────────────────────────────────────────────────
SEED_EXPEDITIONS = [
    {
        'title': "Trek Tassili n'Ajjer",
        'category': 'expedition',
        'difficulty': 'difficult',
        'duration_days': 7,
        'price_dzd': 65000,
        'location': "Tassili n'Ajjer",
        'latitude': 25.500000,
        'longitude': 8.500000,
        'start_date': '2024-10-15',
        'description': (
            "Une expédition inoubliable au cœur du parc national du Tassili n'Ajjer, "
            "classé au patrimoine mondial de l'UNESCO. Découvrez des paysages lunaires, "
            "des gravures rupestres millénaires et des dunes de sable à perte de vue. "
            "Cette aventure de 7 jours vous emmène à travers l'un des plus grands musées "
            "à ciel ouvert du monde."
        ),
        'cover_color': (210, 140, 80),   # sandy orange
        'gallery_colors': [
            ((180, 120, 60),  "Gravures rupestres du Tassili"),
            ((200, 160, 100), "Coucher de soleil sur les dunes"),
            ((160, 100, 50),  "Campement dans le désert"),
        ],
    },
    {
        'title': 'Weekend Tikjda',
        'category': 'bivouac',
        'difficulty': 'moderate',
        'duration_days': 2,
        'price_dzd': 4500,
        'location': 'Tikjda',
        'latitude': 36.450000,
        'longitude': 4.150000,
        'start_date': '2024-07-12',
        'description': (
            "Un week-end d'évasion dans la magnifique région de Tikjda, au cœur du parc "
            "national du Djurdjura. Randonnées en forêt, nuits en bivouac sous les étoiles "
            "et découverte de la faune et de la flore du massif montagneux. Une parenthèse "
            "nature idéale pour se ressourcer le temps d'un week-end."
        ),
        'cover_color': (80, 150, 80),     # forest green
        'gallery_colors': [
            ((60, 130, 60),   "Forêt de cèdres du Djurdjura"),
            ((100, 170, 100), "Vue panoramique depuis le sommet"),
            ((140, 200, 140), "Bivouac en montagne"),
        ],
    },
]


class Command(BaseCommand):
    help = 'Seed the database with sample expedition records (idempotent).'

    def _make_placeholder_image(self, color, width=800, height=600):
        """Generate a solid-color placeholder image and return it as a ContentFile."""
        img = Image.new('RGB', (width, height), color)
        buf = io.BytesIO()
        img.save(buf, format='JPEG', quality=85)
        buf.seek(0)
        return ContentFile(buf.read())

    def handle(self, *args, **options):
        created_count = 0
        updated_count = 0

        for data in SEED_EXPEDITIONS:
            slug = slugify(data['title'])
            cover = self._make_placeholder_image(data['cover_color'])

            expedition, created = Expedition.objects.get_or_create(
                slug=slug,
                defaults={
                    'title': data['title'],
                    'category': data['category'],
                    'difficulty': data['difficulty'],
                    'duration_days': data['duration_days'],
                    'price_dzd': data['price_dzd'],
                    'location': data['location'],
                    'latitude': data['latitude'],
                    'longitude': data['longitude'],
                    'start_date': data['start_date'],
                    'description': data['description'],
                    'is_published': True,
                },
            )

            if created:
                # Save cover image
                filename = f"{slug}_cover.jpg"
                expedition.cover_image.save(filename, cover, save=True)
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'Created: {expedition.title}')
                )
            else:
                updated_count += 1
                self.stdout.write(
                    self.style.WARNING(f'Already exists (skipped): {expedition.title}')
                )
                continue  # don't re-add gallery images

            # Add gallery images for newly created expeditions
            for idx, (color, caption) in enumerate(data['gallery_colors']):
                img_file = self._make_placeholder_image(color)
                gallery_image = ExpeditionImage(
                    expedition=expedition,
                    caption=caption,
                    order=idx,
                )
                filename = f"{slug}_gallery_{idx}.jpg"
                gallery_image.image.save(filename, img_file, save=True)
                self.stdout.write(f'    ↳ Gallery image: {caption}')

        self.stdout.write('')
        self.stdout.write(
            self.style.SUCCESS(
                f'Seed complete: {created_count} created, {updated_count} already existed.'
            )
        )
