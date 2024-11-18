import os
import psycopg2
from psycopg2 import sql

DB_NAME = 'catalog_db'
DB_USER = 'postgres'
DB_PASSWORD = 'root'
DB_HOST = 'db'  # Убедитесь, что этот хост соответствует вашему контейнеру PostgreSQL
DB_PORT = '5432'


def create_database():
    connection = psycopg2.connect(user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_PORT)
    connection.autocommit = True

    with connection.cursor() as cursor:
        try:
            # Проверяем, существует ли база данных
            cursor.execute(sql.SQL("SELECT 1 FROM pg_database WHERE datname = {}").format(sql.Identifier(DB_NAME)))
            if cursor.fetchone():
                print(f"Database '{DB_NAME}' already exists.")
            else:
                # Создаем базу данных
                cursor.execute(sql.SQL("CREATE DATABASE {}").format(sql.Identifier(DB_NAME)))
                print(f"Database '{DB_NAME}' created successfully.")
        except Exception as e:
            print(f"An error occurred: {e}")
        finally:
            connection.close()


if __name__ == "__main__":
    create_database()
