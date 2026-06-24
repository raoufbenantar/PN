#!/bin/sh
set -e

PORT=${PORT:-8000}

echo "==> Running migrations..."
python manage.py migrate --noinput

echo "==> Collecting static files..."
python manage.py collectstatic --noinput

echo "==> Starting Gunicorn on 0.0.0.0:$PORT..."
exec gunicorn project_nature.wsgi:application \
    --bind "0.0.0.0:$PORT" \
    --workers 3 \
    --timeout 60 \
    --access-logfile - \
    --error-logfile -
