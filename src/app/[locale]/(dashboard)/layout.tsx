import "@/styles/globals.scss";
import styles from "./layout.module.scss";
import DashboardWrapper from "@/features/(dashboard)";
import DashboardGuard from "@/features/(dashboard)/guards/DashboardGuard";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={styles.container}>
      <DashboardGuard>
        <DashboardWrapper>{children}</DashboardWrapper>
      </DashboardGuard>
    </div>
  );
};

export default DashboardLayout;
