'use client';
import { CheckoutSkeleton } from '@/components/shared/checkout/CheckoutSkeleton';
import CheckoutForm from '@/components/shared/CheckoutForm';
import { Suspense } from 'react';

export default function CheckoutPage() {
  return (
    <div className="container mx-auto py-8">
      <Suspense fallback={<CheckoutSkeleton />}>
        <CheckoutForm />
      </Suspense>
    </div>
  );
}
