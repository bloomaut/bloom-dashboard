"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Share2, Users, DollarSign, ChevronLeft, Inbox, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

const navigation = [
  { name: "Mi Negocio", href: "/my-business", icon: Building2 },
  { name: "Redes Sociales", href: "/social-media", icon: Share2 },
  { name: "Inventario", href: "/catalog", icon: Package },
  { name: "CRM", href: "/crm", icon: Users },
  { name: "Finanzas", href: "/finances", icon: DollarSign },
];

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const isEnPath = pathname.startsWith("/en");

  return (
    <div
      className={cn(
        "bg-white border-r border-gray-200 transition-all duration-300 h-screen min-w-64",
        collapsed ? "w-16" : "w-64",
      )}
      id='sidebar'
    >
      <Link href='/' className='flex items-center px-4 py-3 pl-6'>
        <Image src={"/logotipo_horizontal.png"} alt='Small' width={150} height={150} priority />
      </Link>
      <div className='flex flex-col'>
        <nav className='flex-1 p-4 space-y-2 h-full'>
          {navigation.map(item => {
            const isActive = pathname === item.href;
            const isAllowed = ["my-business", "social-media"].includes(
              item.href.replace(/^\//, ""), // remove leading slash for comparison
            );

            return (
              <Link
                key={item.name}
                href={
                  isAllowed ? (item.href.startsWith("/en") ? item.href : isEnPath ? `/en${item.href}` : item.href) : "#"
                }
                onClick={e => {
                  if (!isAllowed) e.preventDefault(); // stop navigation if disabled
                }}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isAllowed
                    ? isActive
                      ? "bg-red-50 text-red-700 border-l-4 border-red-500"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    : "text-gray-300 cursor-not-allowed opacity-50 bg-gray-50",
                )}
                style={!isAllowed ? { pointerEvents: "none" } : undefined}
              >
                <item.icon className='h-5 w-5 flex-shrink-0' />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/*   <div className='p-4 border-t border-gray-200' style={{ minHeight: "calc(100vh - 16rem)" }}>
           {!isCompleted ? (
            <TutorialStepper />
          ) : (
            <Link
              href='/inbox'
              className='flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            >
              <Inbox className='h-5 w-5' />
              {!collapsed && <span>Go to Inbox</span>}
            </Link>
          )}
        </div> */}
      </div>
    </div>
  );
}
