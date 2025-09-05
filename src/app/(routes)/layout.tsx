import AnimatedBackground from '@/components/shared/AnimatedBackground';
import { ClerkProvider } from '@clerk/nextjs';

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <div>
        <AnimatedBackground />
        <main>{children}</main>
      </div>
    </ClerkProvider>
  );
}
