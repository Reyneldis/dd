// Versión minimalista
'use client';
import { SignIn } from '@clerk/nextjs';
import { ArrowLeft } from 'lucide-react';

import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 grid place-content-center items-center">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Iniciar sesión
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Bienvenido de nuevo a tu cuenta
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-1">
          <div className="p-1">
            <div className="mb-4">
              <Link
                href="/"
                className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al inicio
              </Link>
            </div>

            <SignIn
              appearance={{
                elements: {
                  card: 'bg-transparent shadow-none border-0',
                  headerTitle:
                    'text-2xl font-bold text-gray-900 dark:text-white',
                  headerSubtitle: 'text-gray-600 dark:text-gray-300',
                  formButtonPrimary:
                    'w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors',
                  socialButtonsBlockButton:
                    'w-full py-3 px-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors',
                  formFieldInput:
                    'w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500',
                  footerActionLink:
                    'text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300',
                },
              }}
              path="/login"
              routing="path"
              signUpUrl="/sign-up"
              redirectUrl="/"
            />
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          ¿No tienes una cuenta?{' '}
          <Link
            href="/sign-up"
            className="font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Regístrate
          </Link>
        </div>
      </div>
    </div>
  );
}
