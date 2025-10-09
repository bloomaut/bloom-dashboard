"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Cargamos el spinner sin SSR para evitar diferencias de marcado
const Spinner = dynamic(() => import("react-loader-spinner").then(m => m.TailSpin), { ssr: false });

const LoadingSpinner = ({ home = false }: { home?: boolean }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: home ? "24px" : "12px",
      }}
    >
      {mounted ? (
        <Spinner height={48} width={48} color='#FD7E14' ariaLabel='loading' />
      ) : (
        // Placeholder estable en SSR para evitar mismatches
        <div style={{ width: 48, height: 48 }} />
      )}
    </div>
  );
};

export default LoadingSpinner;
