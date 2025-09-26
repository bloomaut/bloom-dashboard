"use client";
import "@/styles/globals.scss";
import styles from "./styles.module.scss";
import { usePathname } from "next/navigation";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const loginPage = pathname.includes("login");
  const pricingPage = pathname.includes("pricing");

  return (
    <div
      className={loginPage ? styles.login_container : pricingPage ? styles.pricing_container : styles.policy_container}
    >
      {children}
    </div>
  );
};

export default Layout;
