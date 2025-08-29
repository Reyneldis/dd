'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function FooterConditional() {
  const pathname = usePathname();
  const isLoginPage = pathname.startsWith('/login');
  if (isLoginPage) return null;
  return <Footer />;
}
