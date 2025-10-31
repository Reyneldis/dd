#!/bin/bash

# Script para migrar base de datos PostgreSQL local a Supabase
# Uso: ./migrate-postgres-to-supabase.sh

echo "🔄 Iniciando migración de PostgreSQL local a Supabase..."

# Variables - Configura estas según tu entorno
DB_NAME="db_delivery"
DB_USER="postgres"  # Tu usuario de PostgreSQL local
DB_HOST="localhost"
DB_PORT="5432"
SUPABASE_URL=""  # Aquí va tu connection string de Supabase

# Pedir al usuario la información
read -p "Ingresa tu usuario de PostgreSQL local (default: postgres): " input_user
DB_USER=${input_user:-postgres}

read -p "Ingresa tu contraseña de PostgreSQL local: " -s DB_PASSWORD
echo

read -p "Ingresa el host de PostgreSQL local (default: localhost): " input_host
DB_HOST=${input_host:-localhost}

read -p "Ingresa el puerto de PostgreSQL local (default: 5432): " input_port
DB_PORT=${input_port:-5432}

read -p "Ingresa la connection string de Supabase: " SUPABASE_URL

# Exportar datos de la base de datos local
echo "📥 Exportando datos de la base de datos local..."
export PGPASSWORD=$DB_PASSWORD
pg_dump -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -F c -f db_backup.dump

if [ $? -ne 0 ]; then
    echo "❌ Error al exportar la base de datos local"
    exit 1
fi

echo "✅ Backup creado: db_backup.dump"

# Importar a Supabase
echo "📤 Importando datos a Supabase..."
pg_restore -d "$SUPABASE_URL" --no-owner --no-privileges db_backup.dump

if [ $? -ne 0 ]; then
    echo "❌ Error al importar a Supabase"
    exit 1
fi

echo "✅ Migración completada exitosamente!"

# Limpiar archivo temporal
read -p "¿Deseas eliminar el archivo de backup? (y/n): " cleanup
if [ "$cleanup" = "y" ]; then
    rm db_backup.dump
    echo "🗑️  Backup eliminado"
fi
