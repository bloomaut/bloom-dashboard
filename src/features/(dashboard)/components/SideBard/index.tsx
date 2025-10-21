"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Home, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/store/hooks";
import styles from "./styles.module.scss";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { locale } = useParams() as { locale: string };
  const userData = useAppSelector(state => state.userData);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const dict = useTranslations("dict.sidebar.dashboard");

  const navigation = [
    {
      name: dict("navigation.my_business"),
      href: "dashboard/home",
      icon: Home,
      description: dict("navigation.my_business_description"),
    },
    {
      name: dict("navigation.social_media"),
      href: "dashboard/social",
      icon: Share2,
      description: dict("navigation.social_media_description"),
    },
  ];

  return (
    <div className={cn(styles.sidebar, isCollapsed && styles.collapsed)}>
      {/* Logo Section */}
      <div className={styles.logo_section}>
        <Link href={`/${locale}/dashboard`} className={styles.logo_link}>
          <img src='/bloomLogo.png' alt='Bloom Logo' className={styles.logo_image} />
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className={styles.main_navigation}>
        <ul className={styles.navigation_list}>
          {navigation.map(item => {
            const href = `/${locale}/${item.href}`;
            const isActive = pathname === href;
            return (
              <li key={item.name} className={styles.navigation_item}>
                <Link href={href} className={cn(styles.navigation_link, isActive && styles.active)}>
                  <item.icon className={styles.navigation_icon} />
                  {!isCollapsed && (
                    <div className={styles.navigation_text}>
                      <span>{item.name}</span>
                    </div>
                  )}
                  {isActive && <div className={styles.active_indicator} />}
                </Link>

                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className={styles.tooltip}>
                    <div className={styles.tooltip_title}>{item.name}</div>
                    <div className={styles.tooltip_description}>{item.description}</div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Section */}
      <div className={styles.user_section}>
        {!isCollapsed && (
          <Link href={`/${locale}/dashboard/settings`} className={styles.user_info}>
            <div className={styles.user_avatar}>{userData?.name?.charAt(0)?.toUpperCase() || "U"}</div>
            <div className={styles.user_details}>
              <div className={styles.user_name}>{userData?.name || dict("user.default_name")}</div>
              <div className={styles.user_business}>{userData?.client?.name || dict("user.default_business")}</div>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}
