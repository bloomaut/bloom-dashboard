"use client";
import React, { useState } from "react";
import { Sidebar } from "./SideBar/SideBar";
import Dashboard from "./Dashboard/Dashboard";
import Config from "./Configuracion/Config";
import Usuarios from "./Usuarios/Usuarios";

function BackOffice({ children }: Readonly<{ children: React.ReactNode }>) {
  const [tab, setTab] = useState("dashboard");

  const renderTabContent = () => {
    switch (tab) {
      case "dashboard":
        return <Dashboard />;
      case "usuarios":
        return <Usuarios />;
      case "configuracion":
        return <Config />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className='flex h-screen overflow-hidden'>
      <Sidebar setTab={setTab} tab={tab} />
      <main className='flex-1 overflow-auto md:ml-64'>
        <div className='p-4 md:p-6 pt-16 md:pt-6'>{renderTabContent()}</div>
      </main>
    </div>
  );
}

export default BackOffice;
