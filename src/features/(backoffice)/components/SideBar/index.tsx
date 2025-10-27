"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, Settings, Menu, X } from "lucide-react";
import styles from "./styles.module.scss";

const navigation = [
  { name: "Métricas", href: "metrics", icon: LayoutDashboard },
  { name: "Usuarios", href: "users", icon: Users },
  { name: "Configuración", href: "settings", icon: Settings },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { locale } = useParams() as { locale: string };

  return (
    <div>
      {/* Mobile menu button */}
      <Button variant='ghost' size='sm' className={styles.mobileMenuButton} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X className={styles.icon} /> : <Menu className={styles.icon} />}
      </Button>

      {/* Sidebar */}
      <div className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
        <div className={styles.sidebarContent}>
          {/* Logo */}
          <div className={styles.logoSection}>
            <div className={styles.logoContainer}>
              <img
                src='https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-ePi40gb0kXJhXH9GYmnfN47nNuYLNA.png'
                alt='Bloom Logo'
                width='236'
                height='100'
                className={styles.logo}
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className={styles.navigation}>
            {navigation.map(item => {
              const href = `/${locale}/backoffice/${item.href}`;
              const isActive = pathname?.startsWith(href);
              return (
                <Link
                  key={item.name}
                  href={href}
                  className={`${styles.navLink} ${isActive ? styles.active : ""}`}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className={styles.navIcon} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className={styles.footer}>
            <div className={styles.footerContent}>
              <div>Bloom Admin v1.0</div>
              <div className={styles.copyright}>© 2025 Bloom</div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && <div className={styles.overlay} onClick={() => setIsOpen(false)} />}
    </div>
  );
}
