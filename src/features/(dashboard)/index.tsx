"use client";
import type React from "react";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import "@/styles/globals.scss";
import styles from "./styles/dashboard.module.scss";
import { Sidebar } from "@/features/(dashboard)/components/SideBard";
import SideTrack from "@/features/(dashboard)/components/SideTrack";

export default function DashboardWrapper({ children }: Readonly<{ children: React.ReactNode }>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sideTrackOpen, setSideTrackOpen] = useState(false);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('sidebar');
      const sidetrack = document.getElementById('sidetrack');
      const target = event.target as Node;

      if (sidebarOpen && sidebar && !sidebar.contains(target)) {
        setSidebarOpen(false);
      }
      
      if (sideTrackOpen && sidetrack && !sidetrack.contains(target)) {
        setSideTrackOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarOpen, sideTrackOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (sidebarOpen || sideTrackOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [sidebarOpen, sideTrackOpen]);

  return (
    <div className={styles.dashboard_container}>
      {/* Mobile Menu Button */}
      <button
        className={styles.mobile_menu_button}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </button>

      {/* Sidebar Overlay for Mobile */}
      <div 
        className={`${styles.sidebar_overlay} ${sidebarOpen ? styles.overlay_visible : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar Container */}
      <div className={`${styles.sidebar_container} ${sidebarOpen ? styles.sidebar_open : ''}`}>
        <Sidebar 
          collapsed={false} 
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />
      </div>

      {/* SideTrack */}
      <SideTrack 
        isOpen={sideTrackOpen}
        onToggle={() => setSideTrackOpen(!sideTrackOpen)}
      />

      {/* Main Content */}
      <main className={styles.main_content}>
        <div className={styles.content_wrapper}>
          {children}
        </div>
      </main>
    </div>
  );
}
