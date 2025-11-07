// src/components/shared/Logo/Logo.tsx
import Link from 'next/link';

export default function Logo() {
  return (
    <div>
      <Link
        // --- CAMBIOS CLAVE ---
        // 1. 'font-serif' aplica la fuente elegante (Playfair Display)
        // 2. 'flex-col' apila las palabras verticalmente
        // 3. 'items-center' centra ambas palabras
        // 4. 'leading-none' y '-mt-1' reducen el espacio vertical
        className="font-stretch-50% text-xl cursor-pointer font-bold flex flex-col leading-none items-center group"
        href="/"
      >
        {/* 'Delivery' arriba, más grande y con el color de acento */}
        <span className="text-lg text-orange-400 block tracking-wide transition-transform duration-300 group-hover:scale-105 origin-center">
          Delivery
        </span>

        {/* 'Express' abajo, más pequeño y con un color neutro */}
        <span className="textlg text-neutral-600 dark:text-neutral-400 -mt-1 tracking-widest">
          Express
        </span>
      </Link>
    </div>
  );
}
