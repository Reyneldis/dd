// src/app/(routes)/dashboard/configuracion/page.tsx
'use client';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function ConfiguracionPage() {
  const [notificaciones, setNotificaciones] = useState(true);
  const [idioma, setIdioma] = useState('es');
  const [tema, setTema] = useState('system');

  const handleGuardar = () => {
    // Simulación de guardado
    alert('Configuración guardada correctamente');
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-indigo-700 dark:text-indigo-300">
        Configuración del sistema
      </h1>
      <form
        onSubmit={e => {
          e.preventDefault();
          handleGuardar();
        }}
      >
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Notificaciones
          </label>
          <select
            value={notificaciones ? 'on' : 'off'}
            onChange={e => setNotificaciones(e.target.value === 'on')}
            className="w-full p-2 rounded border"
          >
            <option value="on">Activadas</option>
            <option value="off">Desactivadas</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Idioma</label>
          <select
            value={idioma}
            onChange={e => setIdioma(e.target.value)}
            className="w-full p-2 rounded border"
          >
            <option value="es">Español</option>
            <option value="en">Inglés</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Tema</label>
          <select
            value={tema}
            onChange={e => setTema(e.target.value)}
            className="w-full p-2 rounded border"
          >
            <option value="light">Claro</option>
            <option value="dark">Oscuro</option>
            <option value="system">Sistema</option>
          </select>
        </div>
        <Button type="submit" className="mt-4 w-full">
          Guardar configuración
        </Button>
      </form>
    </div>
  );
}
