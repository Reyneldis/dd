// src/components/shared/MinimalNavbar.tsx
import Logo from '@/components/shared/Logo/Logo';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
export default function MinimalNavbar() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo />
          </div>

          {/* Toggle de modo oscuro/claro */}
          <div className="flex items-center space-x-10">
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full p-1">
              <button
                onClick={() => setTheme('light')}
                className={`p-1 rounded-full ${
                  theme === 'light'
                    ? 'bg-white text-gray-900 shadow'
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
                aria-label="Modo claro"
              >
                <Sun className="h-4 w-4" />
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`p-1 rounded-full ${
                  theme === 'dark'
                    ? 'bg-gray-700 text-white shadow'
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
                aria-label="Modo oscuro"
              >
                <Moon className="h-4 w-4" />
              </button>
              <button
                onClick={() => setTheme('system')}
                className={`p-1 rounded-full ${
                  theme === 'system'
                    ? 'bg-blue-500 text-white shadow'
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
                aria-label="Modo sistema"
              >
                <Monitor className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
