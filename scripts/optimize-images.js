#!/usr/bin/env node
// scripts/optimize-images.js
import sharp from 'sharp';
// ... resto del código
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Configuración
const INPUT_DIR = path.join(process.cwd(), 'public', 'img');
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'img', 'optimized');
const QUALITY = 80;
const MAX_WIDTH = 1920;

// Crear directorio de salida si no existe
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Función para optimizar una imagen
async function optimizeImage(inputPath, outputPath) {
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    // Redimensionar si es muy grande
    if (metadata.width > MAX_WIDTH) {
      image.resize(MAX_WIDTH, null, {
        withoutEnlargement: true,
        fit: 'inside',
      });
    }

    // Optimizar según el formato
    if (metadata.format === 'jpeg' || metadata.format === 'jpg') {
      await image
        .jpeg({ quality: QUALITY, progressive: true })
        .toFile(outputPath);
    } else if (metadata.format === 'png') {
      await image
        .png({ quality: QUALITY, progressive: true })
        .toFile(outputPath);
    } else if (metadata.format === 'webp') {
      await image.webp({ quality: QUALITY }).toFile(outputPath);
    } else {
      // Copiar otros formatos sin cambios
      await image.toFile(outputPath);
    }

    console.log(`✅ Optimizada: ${path.basename(inputPath)}`);
  } catch (error) {
    console.error(`❌ Error optimizando ${inputPath}:`, error.message);
  }
}

// Función para procesar directorio recursivamente
async function processDirectory(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Crear subdirectorio en output
      const relativePath = path.relative(INPUT_DIR, filePath);
      const outputSubDir = path.join(OUTPUT_DIR, relativePath);

      if (!fs.existsSync(outputSubDir)) {
        fs.mkdirSync(outputSubDir, { recursive: true });
      }

      await processDirectory(filePath);
    } else if (stat.isFile()) {
      // Verificar si es una imagen
      const ext = path.extname(file).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext)) {
        const relativePath = path.relative(INPUT_DIR, filePath);
        const outputPath = path.join(OUTPUT_DIR, relativePath);

        await optimizeImage(filePath, outputPath);
      }
    }
  }
}

// Función principal
async function main() {
  console.log('🚀 Iniciando optimización de imágenes...');
  console.log(`📁 Directorio de entrada: ${INPUT_DIR}`);
  console.log(`📁 Directorio de salida: ${OUTPUT_DIR}`);

  if (!fs.existsSync(INPUT_DIR)) {
    console.error(`❌ El directorio ${INPUT_DIR} no existe`);
    process.exit(1);
  }

  try {
    await processDirectory(INPUT_DIR);
    console.log('✅ Optimización completada');
  } catch (error) {
    console.error('❌ Error durante la optimización:', error);
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main();
}

module.exports = { optimizeImage, processDirectory };
