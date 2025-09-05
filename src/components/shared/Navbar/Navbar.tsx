'use client';
import { useAdmin } from '@/hooks/use-admin';
import { useCart } from '@/hooks/use-cart';
import { SignOutButton, useAuth, useUser } from '@clerk/nextjs';
import { AnimatePresence, motion } from 'framer-motion';
import {
  LogOut,
  Menu,
  Package,
  Search,
  Shield,
  ShoppingCart,
  User,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import CartModal from '../CartModal';
import ClerkImage from '../ClerkImage';
import Icon from '../Icon';
import Logo from '../Logo/Logo';
import { ModeToggle } from '../model-dark';
import QuickSearch from '../QuickSearch';
import CategoriesDropdown from './CategoriesDropdown';
import { ICONS } from './icons';

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/about', label: 'Sobre nosotros' },
  { href: '/contact', label: 'Contacto' },
];

const NavLink = ({ href, label }: { href: string; label: string }) => {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Link
        href={href}
        className="relative px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 group"
      >
        <motion.span
          className="relative z-10"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          {label}
        </motion.span>
        <motion.span
          className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-indigo-400 to-pink-500 rounded-full"
          whileHover={{ width: '100%' }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
        {active && (
          <motion.span
            layoutId="activeTab"
            className="absolute inset-0 bg-gradient-to-r from-indigo-400/10 to-pink-500/10 rounded-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </Link>
    </motion.div>
  );
};

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isQuickSearchOpen, setIsQuickSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { items } = useCart();
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const { isAdmin } = useAdmin();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);

    // Detectar si es móvil/tablet
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  const totalItems = items.length;

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 dark:bg-neutral-900/95 shadow-lg backdrop-blur-xl border-b border-white/10'
            : 'bg-white dark:bg-neutral-900 lg:bg-transparent lg:dark:bg-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Botón hamburguesa solo visible en móvil/tablet */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-white/20 dark:bg-neutral-800/30 border border-white/20 dark:border-neutral-700/30 shadow-md hover:bg-primary/10 dark:hover:bg-primary/20 transition-all"
              aria-label="Abrir menú"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Logo />
          </div>

          {/* Desktop Nav - oculto en móvil */}
          <div className="hidden lg:flex items-center gap-3">
            {navLinks.map(link => (
              <NavLink key={link.href} href={link.href} label={link.label} />
            ))}
            <CategoriesDropdown />
          </div>

          {/* Acciones en desktop (iconos, avatar, etc.) - oculto en móvil */}
          <div className="hidden lg:flex items-center gap-2">
            <button
              aria-label="Buscar"
              onClick={() => setIsQuickSearchOpen(true)}
              className="p-2 rounded-xl bg-white/10 dark:bg-neutral-800/20 border border-white/20 dark:border-neutral-700/30 hover:bg-primary/10 dark:hover:bg-primary/20 transition-all"
            >
              <Icon paths={ICONS.search.paths} />
            </button>

            <button
              aria-label="Carrito"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-xl bg-white/10 dark:bg-neutral-800/20 border border-white/20 dark:border-neutral-700/30 hover:bg-primary/10 dark:hover:bg-primary/20 transition-all"
            >
              <Icon paths={ICONS.shoppingCart.paths} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Enlace a pedidos solo para usuarios autenticados */}
            {isLoaded && isSignedIn && (
              <Link
                href="/orders"
                className="p-2 rounded-xl bg-white/10 dark:bg-neutral-800/20 border border-white/20 dark:border-neutral-700/30 hover:bg-primary/10 dark:hover:bg-primary/20 transition-all"
                aria-label="Pedidos"
              >
                <Package className="w-5 h-5 text-orange-500" />
              </Link>
            )}

            {isLoaded && isSignedIn && isAdmin && (
              <Link
                href="/admin"
                className="p-2 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 border border-white/20 dark:border-neutral-700/30 hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-all"
                aria-label="Admin"
              >
                <Icon paths={ICONS.shield.paths} />
              </Link>
            )}

            {isLoaded && isSignedIn && user ? (
              <>
                <Link
                  href="/account"
                  className="w-9 h-9 rounded-full overflow-hidden border border-white/20"
                  aria-label="Mi cuenta"
                >
                  <ClerkImage
                    src={user.imageUrl}
                    alt="Avatar"
                    width={36}
                    height={36}
                    className="w-full h-full object-cover"
                  />
                </Link>
                <SignOutButton>
                  <button
                    aria-label="Cerrar sesión"
                    className="p-2 rounded-xl bg-white/10 dark:bg-neutral-800/20 border border-white/20 dark:border-neutral-700/30 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all"
                  >
                    <Icon paths={ICONS.logOut.paths} />
                  </button>
                </SignOutButton>
              </>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-medium"
              >
                <User className="w-4 h-4" />
                Iniciar sesión
              </Link>
            )}

            <ModeToggle />
          </div>

          {/* Iconos de acciones en móvil/tablet */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              aria-label="Buscar"
              onClick={() => setIsQuickSearchOpen(true)}
              className="p-2 rounded-xl bg-white/10 dark:bg-neutral-800/20 border border-white/20 dark:border-neutral-700/30 hover:bg-primary/10 dark:hover:bg-primary/20 transition-all"
            >
              <Search size={20} />
            </button>
            <button
              aria-label="Carrito"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-xl bg-white/10 dark:bg-neutral-800/20 border border-white/20 dark:border-neutral-700/30 hover:bg-primary/10 dark:hover:bg-primary/20 transition-all"
            >
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Sidebar para móviles/tablets */}
      <AnimatePresence>
        {isMenuOpen && isMobile && (
          <>
            {/* Overlay de fondo */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
              className="fixed top-0 left-0 bottom-0 z-50 w-80 max-w-full bg-white dark:bg-neutral-900 shadow-2xl border-r border-neutral-200 dark:border-neutral-800 overflow-y-auto lg:hidden"
            >
              <div className="p-5">
                {/* Encabezado del sidebar */}
                <div className="flex items-center justify-between mb-8">
                  <Logo />
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                    aria-label="Cerrar menú"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Navegación */}
                <div className="space-y-2 mb-8">
                  <h3 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider px-4 mb-2">
                    Navegación
                  </h3>
                  {navLinks.map(link => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center px-4 py-3 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className="px-4 py-3">
                    <CategoriesDropdown />
                  </div>
                </div>

                {/* Acciones rápidas */}
                <div className="space-y-2 mb-8">
                  <h3 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider px-4 mb-2">
                    Acciones
                  </h3>
                  <button
                    onClick={() => {
                      setIsQuickSearchOpen(true);
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-3 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <Search size={18} className="mr-3" />
                    Buscar
                  </button>
                  <button
                    onClick={() => {
                      setIsCartOpen(true);
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-3 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors relative"
                  >
                    <ShoppingCart size={18} className="mr-3" />
                    Carrito
                    {totalItems > 0 && (
                      <span className="absolute right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                        {totalItems}
                      </span>
                    )}
                  </button>

                  {/* Enlace a pedidos solo para usuarios autenticados */}
                  {isLoaded && isSignedIn && (
                    <Link
                      href="/orders"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center w-full px-4 py-3 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    >
                      <Package size={18} className="mr-3 text-orange-500" />
                      Pedidos
                    </Link>
                  )}
                </div>

                {/* Cuenta de usuario */}
                <div className="space-y-2 mb-8">
                  <h3 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider px-4 mb-2">
                    Cuenta
                  </h3>
                  {isLoaded && isSignedIn && user ? (
                    <>
                      <Link
                        href="/account"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center w-full px-4 py-3 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                      >
                        <ClerkImage
                          src={user.imageUrl}
                          alt="Avatar"
                          width={24}
                          height={24}
                          className="rounded-full mr-3"
                        />
                        Mi cuenta
                      </Link>
                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center w-full px-4 py-3 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        >
                          <Shield size={18} className="mr-3 text-yellow-500" />
                          Panel de administración
                        </Link>
                      )}
                      <SignOutButton>
                        <button className="flex items-center w-full px-4 py-3 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                          <LogOut size={18} className="mr-3 text-red-500" />
                          Cerrar sesión
                        </button>
                      </SignOutButton>
                    </>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center w-full px-4 py-3 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    >
                      <User size={18} className="mr-3" />
                      Iniciar sesión
                    </Link>
                  )}
                </div>

                {/* Tema */}
                <div className="px-4 py-3 border-t border-neutral-200 dark:border-neutral-800">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Modo oscuro
                    </span>
                    <ModeToggle />
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <QuickSearch
        isOpen={isQuickSearchOpen}
        onClose={() => setIsQuickSearchOpen(false)}
      />
    </>
  );
}
