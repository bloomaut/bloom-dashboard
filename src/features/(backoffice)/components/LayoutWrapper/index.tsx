import type React from "react";

interface LayoutWrapperProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

export default function LayoutWrapper({ children, title, description, breadcrumbs }: LayoutWrapperProps) {
  return (
    <div className='flex min-h-screen bg-white items-center justify-center'>
      <div className='text-center'>
        <div className='text-2xl font-medium text-gray-600'>Panel de configuracion en desarrollo.</div>
      </div>
    </div>
  );
}
