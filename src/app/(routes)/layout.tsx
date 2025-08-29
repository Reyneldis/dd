import AnimatedBackground from '@/components/shared/AnimatedBackground';

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <AnimatedBackground />
      <main>{children}</main>
    </div>
  );
}
