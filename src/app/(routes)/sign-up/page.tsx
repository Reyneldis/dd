// app/sign-up/page.tsx
'use client';
import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md mx-auto p-8">
        <SignUp
          signInUrl="/sign-in" // Ruta a tu página de inicio de sesión
          afterSignUpUrl="/" // Redirección después del registro
        />
      </div>
    </div>
  );
}
