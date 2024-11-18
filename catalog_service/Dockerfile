# Используем официальный образ Python
FROM python:3.11

# Устанавливаем рабочий каталог
WORKDIR /app

# Копируем файл зависимостей
COPY catalog_service/requirements.txt ./

# Устанавливаем зависимости
RUN pip install --no-cache-dir -r requirements.txt

# Копируем остальные файлы приложения
COPY catalog_service/ .

# Выполняем миграции и запускаем сервер
CMD ["sh", "-c", "python manage.py makemigrations && python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]

