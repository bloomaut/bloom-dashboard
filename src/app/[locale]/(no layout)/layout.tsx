"use client";
import "@/styles/globals.scss";
import styles from "./styles.module.scss";
import { usePathname } from "next/navigation";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const loginPage = pathname.includes("login");

  return <div className={loginPage ? styles.login_container : styles.policy_container}>{children}</div>;
};

export default Layout;
