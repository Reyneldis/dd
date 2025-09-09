// src/app/(routes)/sign-up/page.tsx
import { SignUp } from '@clerk/nextjs';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al inicio
          </Link>
        </div>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Crear cuenta
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Únete a nuestra comunidad hoy mismo
          </p>
        </div>
        <SignUp
          appearance={{
            elements: {
              formButtonPrimary:
                'bg-blue-600 hover:bg-blue-700 text-sm normal-case',
              card: 'bg-transparent shadow-none',
              headerTitle: 'hidden',
              headerSubtitle: 'hidden',
              socialButtonsBlockButton:
                'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700',
              socialButtonsBlockButtonText: 'text-gray-700 dark:text-gray-200',
              dividerLine: 'bg-gray-200 dark:bg-gray-700',
              dividerText: 'text-gray-500 dark:text-gray-400',
              formFieldInput:
                'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md',
              footerActionLink:
                'text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300',
              // Ocultar el footer
              footer: 'hidden',
              // También puedes ocultar otros elementos si lo deseas
              terms: 'hidden',
              helpText: 'hidden',
            },
          }}
          path="/sign-up"
          routing="path"
          signInUrl="/sign-in"
          redirectUrl="/"
        />
      </div>
    </div>
  );
}
