import "@/styles/globals.scss";
import styles from "./layout.module.scss";

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className={styles.container}>{children}</div>;
};

export default PublicLayout;
