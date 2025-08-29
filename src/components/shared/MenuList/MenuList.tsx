'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Store, Package, Gift, Info, ChevronRight } from 'lucide-react';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';

const components: { title: string; href: string; description: string }[] = [
  {
    title: 'Combo de comida',
    href: '/category/comida',
    description: 'Combo de comida para el difrute de su hogar',
  },
  {
    title: 'Aseos y limpiesa',
    href: '/category/aseos',
    description: 'Todo tipo de aseos y productos para su hogar',
  },
  {
    title: 'Productos electricos',
    href: '/category/Electrodomesticos',
    description: 'Todo tipo de productos electrodomesticos para su hogar',
  },
];

export function MenuList() {
  const pathname = usePathname();
  const isMobile = pathname?.includes('mobile');
  const [openSubmenu, setOpenSubmenu] = React.useState<string | null>(null);

  if (isMobile) {
    return (
      <nav className="flex flex-col">
        <div className="grid grid-cols-1 gap-2">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg bg-accent/50 p-4 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
          >
            <Home className="h-5 w-5" />
            <span>Inicio</span>
          </Link>
          <Link
            href="/shop"
            className="flex items-center gap-3 rounded-lg bg-accent/50 p-4 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
          >
            <Store className="h-5 w-5" />
            <span>Tienda</span>
          </Link>
          <div className="space-y-2">
            <button
              onClick={() =>
                setOpenSubmenu(openSubmenu === 'productos' ? null : 'productos')
              }
              className="flex w-full items-center justify-between rounded-lg bg-accent/50 p-4 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5" />
                <span>Productos</span>
              </div>
              <ChevronRight
                className={`h-4 w-4 transition-transform ${
                  openSubmenu === 'productos' ? 'rotate-90' : ''
                }`}
              />
            </button>
            {openSubmenu === 'productos' && (
              <div className="ml-4 space-y-2 border-l pl-4">
                {components.map(component => (
                  <Link
                    key={component.title}
                    href={component.href}
                    className="block rounded-lg bg-accent/30 p-3 text-sm hover:bg-accent hover:text-accent-foreground"
                  >
                    <div className="font-medium">{component.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {component.description}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link
            href="/offers"
            className="flex items-center gap-3 rounded-lg bg-accent/50 p-4 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
          >
            <Gift className="h-5 w-5" />
            <span>Ofertas</span>
          </Link>
          <Link
            href="/about"
            className="flex items-center gap-3 rounded-lg bg-accent/50 p-4 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
          >
            <Info className="h-5 w-5" />
            <span>Sobre Nosotros</span>
          </Link>
        </div>
      </nav>
    );
  }

  return (
    <NavigationMenu viewport={false} className="">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Sobre Nosotros</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr] ">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <Link
                    className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-6 no-underline outline-hidden select-none focus:shadow-md"
                    href="/"
                  >
                    <div className="mt-4 mb-2 text-lg font-medium">
                      TiendaDev
                    </div>
                    <p className="text-muted-foreground text-sm leading-tight">
                      Somos una tienda online de productos de cuidado personal,
                      electrónicos, entre otros. Nos encanta la comida, la
                      limpieza, los accesorios y los productos eléctricos.
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <ListItem href="/shop" title="Tienda">
                No pierdas la oportunidad de obtener todo tipo de producto para
                tu hogar.
              </ListItem>
              <ListItem href="/offers" title="Ofertas">
                Seccion dedicada a descuentos y ofertas.
              </ListItem>
              <ListItem href="/" title="Accesorios">
                Todo tipo de accesorios para tu hogar.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Productos</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {components.map(component => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/accesorios">Accesorios</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<'li'> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
