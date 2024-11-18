#!/bin/bash

# Выполняем инициализацию базы данных
python init_db.py

# Применяем миграции
python manage.py makemigrations
python manage.py migrate

# Создаем суперпользователя, если он еще не существует
python manage.py shell -c "
from django.contrib.auth import get_user_model;
User = get_user_model();
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'adminpassword');
exit()
"

# Запускаем сервер Django
python manage.py runserver 0.0.0.0:8000
