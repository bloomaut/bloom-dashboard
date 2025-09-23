"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, Settings, Menu, X } from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Gestión de Usuarios",
    href: "usuarios",
    icon: Users,
  },
  {
    name: "Configuración",
    href: "configuracion",
    icon: Settings,
  },
];

export function Sidebar({ setTab, tab }: { setTab: (tab: string) => void; tab: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div>
      {/* Mobile menu button */}
      <Button
        variant='ghost'
        size='sm'
        className='fixed top-4 left-4 z-50 md:hidden bg-background border border-border'
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className='h-6 w-6' /> : <Menu className='h-6 w-6' />}
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-200 ease-in-out md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className='flex flex-col h-full'>
          {/* Logo */}
          <div className='flex items-center h-16 pr-6 border-b border-sidebar-border justify-center'>
            <div className='flex justify-start items-center'>
              <img
                src='https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-ePi40gb0kXJhXH9GYmnfN47nNuYLNA.png'
                alt='Bloom Logo'
                width='236'
                height='100'
                className='w-35 h-auto object-contain'
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className='flex-1 px-4 py-6 space-y-2'>
            {navigation.map(item => {
              return (
                <div
                  key={item.name}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors group cursor-pointer",
                    tab === item.href
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                  onClick={() => {
                    console.log(item.href), setTab(item.href);
                  }}
                >
                  <div className='flex items-center'>
                    <item.icon className='mr-3 h-5 w-5' />
                    {item.name}
                  </div>
                </div>
              );
            })}
          </nav>

          {/* Footer */}
          <div className='p-4 border-t border-sidebar-border'>
            <div className='text-xs text-muted-foreground text-center'>
              <div>Bloom Admin v1.0</div>
              <div className='mt-1'>© 2025 Bloom</div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div className='fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden' onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
}
