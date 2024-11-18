# Используем официальный образ Python
FROM python:3.11

# Устанавливаем рабочий каталог
WORKDIR /app

# Копируем файл зависимостей
COPY user_service/requirements.txt ./

# Устанавливаем зависимости
RUN pip install --no-cache-dir -r requirements.txt

# Копируем остальные файлы приложения
COPY user_service/ ./

# Копируем entrypoint скрипт в контейнер
COPY user_service/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Устанавливаем entrypoint
ENTRYPOINT ["/entrypoint.sh"]
