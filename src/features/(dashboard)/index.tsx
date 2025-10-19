"use client";
import type React from "react";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import "@/styles/globals.scss";
import styles from "./styles/dashboard.module.scss";
import Sidebar from "@/features/(dashboard)/components/SideBard";

export default function DashboardWrapper({ children }: Readonly<{ children: React.ReactNode }>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById("sidebar");
      const target = event.target as Node;

      if (sidebarOpen && sidebar && !sidebar.contains(target)) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [sidebarOpen]);

  return (
    <div className={styles.dashboard_container}>
      {/* Mobile Menu Button */}
      <button
        className={styles.mobile_menu_button}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label='Toggle sidebar'
      >
        {sidebarOpen ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
      </button>

      {/* Sidebar Overlay for Mobile */}
      <div
        className={`${styles.sidebar_overlay} ${sidebarOpen ? styles.overlay_visible : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar Container */}
      <div className={`${styles.sidebar_container} ${sidebarOpen ? styles.sidebar_open : ""}`}>
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      </div>

      {/* Main Content */}
      <main className={styles.main_content}>
        <div className={styles.content_wrapper}>{children}</div>
      </main>
    </div>
  );
}
