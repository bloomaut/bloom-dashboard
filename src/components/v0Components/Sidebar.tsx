"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Share2, Users, DollarSign, ChevronLeft, Inbox, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTutorial } from "@/context/TutorialContext";
import { TutorialStepper } from "./TutorialStepper";

const navigation = [
  { name: "Mi Negocio", href: "/my-business", icon: Building2 },
  { name: "Inventario", href: "/catalog", icon: Package },
  { name: "Redes Sociales", href: "/social-media", icon: Share2 },
  { name: "CRM", href: "/crm", icon: Users },
  { name: "Finanzas", href: "/finances", icon: DollarSign },
];

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { isCompleted } = useTutorial();
  const isEnPath = pathname.startsWith("/en");

  return (
    <div
      className={cn("bg-white border-r border-gray-200 transition-all duration-300", collapsed ? "w-16" : "w-64")}
      id='sidebar'
    >
      <div className='flex flex-col'>
        <nav className='flex-1 p-4 space-y-2'>
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
                    : "text-gray-400 cursor-not-allowed",
                )}
              >
                <item.icon className='h-5 w-5 flex-shrink-0' />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className='p-4 border-t border-gray-200' style={{ minHeight: "calc(100vh - 16rem)" }}>
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
        </div>
      </div>
    </div>
  );
}
