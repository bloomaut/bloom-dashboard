"use client";
import "@/styles/globals.scss";
import styles from "./styles.module.scss";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <div className={styles.layout_container}>{children}</div>;
};

export default Layout;
