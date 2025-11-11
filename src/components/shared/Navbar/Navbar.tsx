'use client';
import { useAdmin } from '@/hooks/use-admin';
import { useCart } from '@/hooks/use-cart';
import { SignOutButton, useAuth, useUser } from '@clerk/nextjs';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  Search,
  ShoppingCart,
  User,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import AnimatedMenuIcon from '../AnimatedMenuIcon';
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

const NavLink = ({
  href,
  label,
  isScrolled,
  theme,
}: {
  href: string;
  label: string;
  isScrolled: boolean;
  theme: string | undefined;
}) => {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      <Link href={href} className="group relative block rounded-lg px-5 py-1.5">
        <motion.div
          className={`absolute inset-0 z-0 rounded-lg ${
            isScrolled
              ? 'bg-neutral-100 dark:bg-neutral-800'
              : 'bg-neutral-200/50 dark:bg-neutral-700/50'
          }`}
          initial={{ opacity: 0 }}
          whileHover={{
            opacity: 1,
            transition: { duration: 0.2, ease: 'easeOut' },
          }}
        />

        <motion.span
          className={`relative z-10 block transition-colors duration-300 font-medium text-sm ${
            isScrolled
              ? theme === 'dark'
                ? 'text-neutral-300 group-hover:text-white'
                : 'text-neutral-700 group-hover:text-neutral-900'
              : theme === 'dark'
              ? 'text-neutral-400 group-hover:text-neutral-200'
              : 'text-neutral-600 group-hover:text-neutral-800'
          }`}
          whileHover={{ x: 2 }}
          transition={{ duration: 0.2 }}
        >
          {label}
        </motion.span>

        {active && (
          <motion.span
            layoutId="activeTab"
            className={`absolute -bottom-px left-5 right-5 h-[2px] rounded-full ${
              isScrolled
                ? 'bg-neutral-800 dark:bg-neutral-200'
                : 'bg-neutral-700 dark:bg-neutral-300'
            }`}
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
  const [isMounted, setIsMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isQuickSearchOpen, setIsQuickSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { items } = useCart();
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const { isAdmin, loading } = useAdmin();
  const { theme } = useTheme();

  useEffect(() => {
    setIsMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const totalItems = items.length;

  const mobileMenuVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
    exit: {
      transition: { staggerChildren: 0.05, staggerDirection: -1 },
    },
  } as Variants;

  const mobileItemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
    exit: {
      y: -20,
      opacity: 0,
      transition: { duration: 0.2, ease: 'easeIn' },
    },
  } as Variants;

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        // --- CAMBIO CLAVE: Efecto "Espejo Empañado" ---
        className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-gradient-to-b from-white/70 dark:from-black/70 to-transparent backdrop-blur-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="px-4 sm:px-6 lg:px-20 py-2 sm:py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <AnimatedMenuIcon
              isOpen={isMenuOpen}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              isScrolled={isScrolled}
            />
            <Logo />
          </div>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <NavLink
                key={link.href}
                href={link.href}
                label={link.label}
                isScrolled={isScrolled}
                theme={theme}
              />
            ))}
            <CategoriesDropdown />
          </div>

          {/* Iconos de móvil (mejorados) */}
          <div
            className={`flex items-center gap-2 lg:hidden transition-opacity duration-300 ${
              isMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
          >
            <button
              aria-label="Buscar"
              onClick={() => setIsQuickSearchOpen(true)}
              className={`p-2 rounded-xl transition-all duration-300 ${
                isScrolled
                  ? 'bg-white/80 dark:bg-black/80 border border-white/30 dark:border-white/20 hover:bg-white dark:hover:bg-black'
                  : 'bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10 hover:bg-white/20 dark:hover:bg-black/20'
              }`}
            >
              <span
                className={
                  isScrolled
                    ? theme === 'dark'
                      ? 'text-neutral-200'
                      : 'text-neutral-800'
                    : theme === 'dark'
                    ? 'text-white'
                    : 'text-neutral-900'
                }
              >
                <Search size={18} />
              </span>
            </button>
            <button
              aria-label="Carrito"
              onClick={() => setIsCartOpen(true)}
              className={`relative p-2 rounded-xl transition-all duration-300 ${
                isScrolled
                  ? 'bg-white/80 dark:bg-black/80 border border-white/30 dark:border-white/20 hover:bg-white dark:hover:bg-black'
                  : 'bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10 hover:bg-white/20 dark:hover:bg-black/20'
              }`}
            >
              <span
                className={
                  isScrolled
                    ? theme === 'dark'
                      ? 'text-neutral-200'
                      : 'text-neutral-800'
                    : theme === 'dark'
                    ? 'text-white'
                    : 'text-neutral-900'
                }
              >
                <ShoppingCart size={18} />
              </span>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                  {totalItems}
                </span>
              )}
            </button>
          </div>

          {/* Contenido de escritorio (sin cambios) */}
          <div className="hidden lg:flex items-center gap-2">
            <button
              aria-label="Buscar"
              onClick={() => setIsQuickSearchOpen(true)}
              className={`p-2 rounded-xl transition-all duration-300 ${
                isScrolled
                  ? 'bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                  : 'bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10 hover:bg-white/20 dark:hover:bg-black/20'
              }`}
            >
              <span
                className={
                  isScrolled
                    ? theme === 'dark'
                      ? 'text-neutral-800'
                      : 'text-neutral-900'
                    : theme === 'dark'
                    ? 'text-neutral-200'
                    : 'text-neutral-700'
                }
              >
                <Icon paths={ICONS.search.paths} />
              </span>
            </button>
            <button
              aria-label="Carrito"
              onClick={() => setIsCartOpen(true)}
              className={`relative p-2 rounded-xl transition-all duration-300 ${
                isScrolled
                  ? 'bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                  : 'bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10 hover:bg-white/20 dark:hover:bg-black/20'
              }`}
            >
              <span
                className={
                  isScrolled
                    ? theme === 'dark'
                      ? 'text-neutral-800'
                      : 'text-neutral-900'
                    : theme === 'dark'
                    ? 'text-neutral-200'
                    : 'text-neutral-700'
                }
              >
                <Icon paths={ICONS.shoppingCart.paths} />
              </span>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                  {totalItems}
                </span>
              )}
            </button>

            {isLoaded && isSignedIn && (
              <Link
                href="/orders"
                className={`p-2 rounded-xl transition-all duration-300 ${
                  isScrolled
                    ? 'bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                    : 'bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10 hover:bg-white/20 dark:hover:bg-black/20'
                }`}
                aria-label="Pedidos"
              >
                <span
                  className={
                    isScrolled
                      ? theme === 'dark'
                        ? 'text-neutral-800'
                        : 'text-neutral-900'
                      : theme === 'dark'
                      ? 'text-neutral-200'
                      : 'text-neutral-700'
                  }
                >
                  <Package className="w-5 h-5 text-orange-500" />
                </span>
              </Link>
            )}

            {!loading && isAdmin && (
              <Link
                href="/dashboard"
                className={`p-2 rounded-xl transition-all duration-300 ${
                  isScrolled
                    ? 'bg-indigo-100 dark:bg-indigo-900/30 border border-neutral-200 dark:border-neutral-700 hover:bg-indigo-200 dark:hover:bg-indigo-900/50'
                    : 'bg-indigo-500/20 border border-indigo-500/30 hover:bg-indigo-500/30'
                }`}
                aria-label="Dashboard"
              >
                <span
                  className={
                    isScrolled
                      ? theme === 'dark'
                        ? 'text-neutral-800'
                        : 'text-neutral-900'
                      : theme === 'dark'
                      ? 'text-neutral-200'
                      : 'text-neutral-700'
                  }
                >
                  <LayoutDashboard className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </span>
              </Link>
            )}

            {isLoaded && isSignedIn && user ? (
              <>
                <Link
                  href="/account"
                  className={`w-9 h-9 rounded-full overflow-hidden border ${
                    isScrolled
                      ? 'border-neutral-300 dark:border-neutral-600'
                      : 'border-white/30 dark:border-white/20'
                  }`}
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
                    className={`p-2 rounded-xl transition-all duration-300 ${
                      isScrolled
                        ? 'bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:bg-red-100 dark:hover:bg-red-900/30'
                        : 'bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10 hover:bg-red-500/20'
                    }`}
                  >
                    <span
                      className={
                        isScrolled
                          ? theme === 'dark'
                            ? 'text-neutral-800'
                            : 'text-neutral-900'
                          : theme === 'dark'
                          ? 'text-neutral-200'
                          : 'text-neutral-700'
                      }
                    >
                      <Icon paths={ICONS.logOut.paths} />
                    </span>
                  </button>
                </SignOutButton>
              </>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 dark:bg-black/10 hover:bg-white/20 dark:hover:bg-black/20 text-sm font-medium"
              >
                <span
                  className={
                    isScrolled
                      ? theme === 'dark'
                        ? 'text-neutral-800'
                        : 'text-neutral-900'
                      : theme === 'dark'
                      ? 'text-neutral-200'
                      : 'text-neutral-700'
                  }
                >
                  <User className="w-4 h-4" />
                </span>
                Iniciar sesión
              </Link>
            )}
            <ModeToggle />
          </div>
        </div>
      </motion.nav>

      {/* Menú móvil de pantalla completa (mejorado para móvil) */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-lg lg:hidden"
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.div
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col items-center justify-start pt-20 sm:pt-32 h-full p-4 sm:p-8"
              onClick={e => e.stopPropagation()}
            >
              {/* Enlaces de Navegación */}
              <nav className="flex flex-col items-center space-y-6 mb-12">
                {navLinks.map(link => (
                  <motion.div key={link.href} variants={mobileItemVariants}>
                    <Link
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="text-2xl sm:text-4xl font-bold text-neutral-900 dark:text-white hover:text-orange-400 transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div variants={mobileItemVariants}>
                  <CategoriesDropdown />
                </motion.div>
              </nav>

              {/* Acciones de Usuario */}
              <motion.div
                variants={mobileItemVariants}
                className="flex flex-col items-center gap-4"
              >
                {isLoaded && isSignedIn && user ? (
                  <>
                    <Link
                      href="/account"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 text-lg text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
                    >
                      <ClerkImage
                        src={user.imageUrl}
                        alt="Avatar"
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full object-cover border border-neutral-300 dark:border-neutral-600"
                      />
                      Mi Cuenta
                    </Link>
                    <SignOutButton>
                      <button
                        onClick={() => setIsMenuOpen(false)}
                        className="text-lg text-neutral-600 dark:text-neutral-300 hover:text-red-500 transition-colors"
                      >
                        Cerrar Sesión
                      </button>
                    </SignOutButton>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 text-lg text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
                  >
                    <User className="w-5 h-5" />
                    Iniciar Sesión
                  </Link>
                )}
                <ModeToggle />
              </motion.div>
            </motion.div>
          </motion.div>
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
