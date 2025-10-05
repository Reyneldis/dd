// src/app/(routes)/about/page.tsx

import { Suspense } from 'react';
import AboutContent from './AboutContent';

export default function AboutPage() {
  return (
    <Suspense fallback={<div>Cargando página...</div>}>
      <AboutContent />
    </Suspense>
  );
}
