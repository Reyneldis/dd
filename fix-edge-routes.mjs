// fix-edge-routes.mjs
import fs from 'fs/promises';
import { glob } from 'glob';

// La línea que queremos añadir
const runtimeExport = "export const runtime = 'edge';\n";

// Función para añadir la línea si no existe
async function addRuntimeExport(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    if (content.includes("export const runtime = 'edge'")) {
      console.log(`✅ Ya tiene el runtime: ${filePath}`);
      return;
    }

    const newContent = runtimeExport + content;
    await fs.writeFile(filePath, newContent, 'utf8');
    console.log(`🔧 Añadido runtime a: ${filePath}`);
  } catch (error) {
    console.error(`❌ Error procesando ${filePath}:`, error);
  }
}

// Función principal asíncrona
async function main() {
  console.log('🚀 Iniciando corrección de Edge Runtime...');

  try {
    // Patrones para encontrar los archivos que necesitan el Edge Runtime
    const apiRoutePattern = 'src/app/api/**/route.ts';
    const dynamicPagePattern = 'src/app/**/[*]/page.tsx';

    // Encontrar y procesar rutas de API
    const apiFiles = glob.sync(apiRoutePattern);
    console.log(`📁 Encontradas ${apiFiles.length} rutas de API.`);
    await Promise.all(apiFiles.map(addRuntimeExport));

    // Encontrar y procesar páginas dinámicas
    const pageFiles = glob.sync(dynamicPagePattern);
    console.log(`📄 Encontradas ${pageFiles.length} páginas dinámicas.`);
    await Promise.all(pageFiles.map(addRuntimeExport));

    // También procesar el middleware
    const middlewarePath = 'src/middleware.ts';
    try {
      await fs.access(middlewarePath); // fs.access es la forma moderna de comprobar si un archivo existe
      await addRuntimeExport(middlewarePath);
    } catch {
      // Si no existe, no hacemos nada
    }

    console.log(
      '✅ ¡Proceso completado! Todos los archivos ahora tienen el Edge Runtime.',
    );
  } catch (error) {
    console.error('❌ Ocurrió un error durante el proceso:', error);
    process.exit(1); // Salir con error si algo falla
  }
}

// Ejecutar la función principal
main();
