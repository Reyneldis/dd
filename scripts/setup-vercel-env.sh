#!/bin/bash

# Script para configurar variables de entorno en Vercel
# Requiere tener el CLI de Vercel instalado: npm i -g vercel

echo "🚀 Configuración de variables de entorno en Vercel"
echo ""

# Verificar si vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI no está instalado"
    echo "📦 Instalando Vercel CLI..."
    npm install -g vercel
fi

echo "📝 Pasos para configurar las variables de entorno:"
echo ""
echo "1️⃣  Inicia sesión en Vercel (si no lo has hecho):"
echo "   vercel login"
echo ""
echo "2️⃣  Vincula tu proyecto a Vercel:"
echo "   vercel link"
echo ""
echo "3️⃣  Agrega las variables de entorno desde tu archivo .env.local:"
echo ""
echo "Variables necesarias:"
echo "  - DATABASE_URL (desde Supabase)"
echo "  - DIRECT_URL (desde Supabase)"
echo "  - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"
echo "  - CLERK_SECRET_KEY"
echo "  - GMAIL_USER"
echo "  - GMAIL_APP_PASSWORD"
echo "  - NEXT_PUBLIC_WHATSAPP_ADMINS"
echo ""
echo "Ejemplo de comandos:"
echo "vercel env add DATABASE_URL production"
echo "vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY production"
echo ""
echo "4️⃣  Para todas las variables, repite el comando con diferentes nombres"
echo ""
echo "💡 Alternativa: Hazlo desde el dashboard de Vercel:"
echo "   1. Ve a tu proyecto en vercel.com"
echo "   2. Settings > Environment Variables"
echo "   3. Agrega cada variable manualmente"
echo ""
