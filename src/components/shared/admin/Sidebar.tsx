'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingCart, Package, Users, Star, LayoutGrid, ArrowLeft } from 'lucide-react';
import Logo from '../Logo/Logo';

const adminNavLinks = [
  { href: '/admin', label: 'Dashboard', icon: Home },
  { href: '/admin/orders', label: 'Pedidos', icon: ShoppingCart },
  { href: '/admin/products', label: 'Productos', icon: Package },
  { href: '/admin/categories', label: 'Categorías', icon: LayoutGrid },
  { href: '/admin/users', label: 'Usuarios', icon: Users },
  { href: '/admin/reviews', label: 'Reseñas', icon: Star },
];

interface NavLinkProps {
    href: string;
    label: string;
    icon: React.ElementType;
    onLinkClick?: () => void;
}

const NavLink = ({ href, label, icon: Icon, onLinkClick }: NavLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname.startsWith(href) && (href !== '/admin' || pathname === '/admin');

  return (
    <Link href={href} onClick={onLinkClick}>
      <span
        className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
          isActive
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
        }`}
      >
        <Icon className="w-5 h-5 mr-3" />
        {label}
      </span>
    </Link>
  );
};

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
        {/* Mobile overlay */}
        {isOpen && <div className="fixed inset-0 bg-black/60 z-30 md:hidden" onClick={onClose}></div>}

        <aside className={`fixed top-0 left-0 h-full w-64 bg-background p-4 flex-col z-40 transform transition-transform md:relative md:translate-x-0 md:flex md:flex-shrink-0 md:border-r ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="mb-8">
                <Logo />
            </div>
            <nav className="flex flex-col gap-2 flex-grow">
                {adminNavLinks.map(link => (
                <NavLink key={link.href} {...link} onLinkClick={onClose} />
                ))}
            </nav>
            <div className="mt-auto">
                <NavLink href="/" label="Volver al Sitio" icon={ArrowLeft} onLinkClick={onClose} />
            </div>
        </aside>
    </>
  );
}