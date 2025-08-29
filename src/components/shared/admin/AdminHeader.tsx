'use client';

import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

interface AdminHeaderProps {
  onMenuClick: () => void;
}

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  return (
    <header className="md:hidden flex items-center justify-between p-4 border-b bg-background">
      {/* We can add a logo or title here later */}
      <div></div>
      <Button variant="outline" size="icon" onClick={onMenuClick}>
        <Menu className="h-6 w-6" />
      </Button>
    </header>
  );
}
