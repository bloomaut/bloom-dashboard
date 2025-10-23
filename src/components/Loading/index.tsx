"use client";
import { useEffect, useState } from "react";
import styles from "./styles.module.scss";

export type LoadingSize = "small" | "medium" | "large";

interface LoadingSpinnerProps {
  home?: boolean;
  size?: LoadingSize;
}

const LoadingSpinner = ({ home = false, size = "small" }: LoadingSpinnerProps) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const containerClass = `${styles.loadingWrapper} ${styles[`loading${size.charAt(0).toUpperCase() + size.slice(1)}`]} ${home ? styles.loadingHome : ""}`;

  return (
    <div className={containerClass}>
      {mounted ? (
        <div className={styles.spinner} data-size={size}>
          <div className={styles.dot}></div>
          <div className={styles.dot}></div>
          <div className={styles.dot}></div>
        </div>
      ) : (
        // Placeholder estable en SSR
        <div className={styles.placeholder} data-size={size}></div>
      )}
    </div>
  );
};

export default LoadingSpinner;
