// fix-runtime-revert.mjs
import fs from 'fs/promises';
import path from 'path';
import { glob } from 'glob';

const edgeRuntimeLine = "export const runtime = 'edge';\n";
const nodeRuntimeLine = "export const runtime = 'nodejs';\n";

// Detecta si el archivo usa módulos nativos de Node.js
function needsNodeRuntime(content) {
  return /from ['"]fs['"]|from ['"]fs\/promises['"]|from ['"]path['"]/.test(content);
}

// Elimina la línea de edge runtime y agrega nodejs si corresponde
async function fixRuntime(filePath) {
  try {
    let content = await fs.readFile(filePath, 'utf8');
    let changed = false;

    // Elimina cualquier runtime edge
    if (content.includes(edgeRuntimeLine)) {
      content = content.replace(edgeRuntimeLine, '');
      changed = true;
    }
    // Elimina cualquier runtime edge inline
    content = content.replace(/export const runtime = 'edge';\s*/g, '');

    // Si usa módulos nativos, agrega nodejs runtime al inicio si no existe
    if (needsNodeRuntime(content) && !content.includes(nodeRuntimeLine)) {
      content = nodeRuntimeLine + content;
      changed = true;
    }

    if (changed) {
      await fs.writeFile(filePath, content, 'utf8');
      console.log(`🔧 Corregido runtime en: ${filePath}`);
    } else {
      console.log(`✅ Sin cambios necesarios: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error procesando ${filePath}:`, error);
  }
}

async function main() {
  console.log('🚀 Revirtiendo Edge Runtime y corrigiendo Node.js Runtime...');
  const apiRoutePattern = 'src/app/api/**/route.ts';
  const dynamicPagePattern = 'src/app/**/[*]/page.tsx';
  const middlewarePath = 'src/middleware.ts';

  const apiFiles = glob.sync(apiRoutePattern);
  const pageFiles = glob.sync(dynamicPagePattern);
  const allFiles = [...apiFiles, ...pageFiles, middlewarePath];

  await Promise.all(allFiles.map(fixRuntime));
  console.log('✅ ¡Proceso completado!');
}

main();
