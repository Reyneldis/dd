'use client';
import { SignIn } from '@clerk/nextjs';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md mx-auto p-8">
        <SignIn afterSignInUrl="/" signUpUrl="/sign-up" />
      </div>
    </div>
  );
}
