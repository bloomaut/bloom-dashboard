"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Share2, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useAppSelector } from "@/store/hooks";

const navigation = [
  { name: "Mi Negocio", href: "/dashboard/home", icon: Building2, description: "Gestiona tu información empresarial" },
  { name: "Redes Sociales", href: "/dashboard/social", icon: Share2, description: "Administra tu presencia digital" },
];

const bottomNavigation = [
  { name: "Configuración", href: "/settings", icon: Settings },
  { name: "Cerrar Sesión", href: "/logout", icon: LogOut },
];

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const isEnPath = pathname.startsWith("/en");
  const userData = useAppSelector(state => state.userData);

  // Determine which routes are allowed based on user status
  const getAllowedRoutes = () => {
    // Both routes are always allowed now
    return ["dashboard/home", "dashboard/social"];
  };

  const allowedRoutes = getAllowedRoutes();

  const isRouteAllowed = (href: string) => {
    const route = href.replace(/^\//, "");
    return allowedRoutes.includes(route);
  };

  return (
    <div
      className={cn(
        "bg-white border-r border-gray-200 transition-all duration-300 h-screen flex flex-col",
        collapsed ? "w-16" : "w-64",
      )}
      id='sidebar'
    >
      {/* Logo Section */}
      <div className="flex-shrink-0 border-b border-gray-100">
        <Link href='/' className='flex items-center px-4 py-4 hover:bg-gray-50 transition-colors'>
          <Image 
            src={"/logotipo_horizontal.png"} 
            alt='Small' 
            width={collapsed ? 32 : 150} 
            height={collapsed ? 32 : 40} 
            priority 
            className="transition-all duration-300"
          />
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className='flex-1 p-4 space-y-2 overflow-y-auto'>
        <div className="space-y-1">
          {navigation.map(item => {
            const isActive = pathname.includes(item.href);

            return (
              <div key={item.name} className="relative group">
                <Link
                  href={item.href.startsWith("/en") ? item.href : isEnPath ? `/en${item.href}` : item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative overflow-hidden",
                    isActive
                      ? "bg-gradient-to-r from-red-50 to-red-100 text-red-700 shadow-sm border-l-4 border-red-500"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm"
                  )}
                >
                  <item.icon className={cn(
                    'h-5 w-5 flex-shrink-0 transition-colors',
                    isActive ? 'text-red-600' : ''
                  )} />
                  {!collapsed && (
                    <div className="flex-1 min-w-0">
                      <span className="block truncate">{item.name}</span>
                    </div>
                  )}
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  )}
                </Link>

                {/* Tooltip for collapsed state */}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                    <div className="font-medium">{item.name}</div>
                    {item.description && (
                      <div className="text-xs text-gray-300 mt-1">{item.description}</div>
                    )}
                    <div className="absolute top-1/2 -left-1 transform -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* User Info Section */}
      {!collapsed && userData && (
        <div className="flex-shrink-0 border-t border-gray-100 p-4">
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {userData.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {userData.name || 'Usuario'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {userData.client?.name || 'Mi Negocio'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="flex-shrink-0 border-t border-gray-100 p-4 space-y-1">
        {bottomNavigation.map(item => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <item.icon className='h-5 w-5 flex-shrink-0' />
            {!collapsed && <span>{item.name}</span>}
          </Link>
        ))}
      </div>
    </div>
  );
}
