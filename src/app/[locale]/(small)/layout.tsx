import "@/styles/globals.scss";
import "react-toastify/dist/ReactToastify.css";
import styles from "./styles.module.scss";
import { ToastContainer } from "react-toastify";
import { Slide } from "react-toastify";
// Components
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import SideTrack from "@/components/SideTrack";
import ClarityWrapper from "@/components/ClarityWrapper";

const SmallLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClarityWrapper>
      <div className={styles.container}>
        <Navbar />
        <ToastContainer
          position='bottom-right'
          limit={2}
          autoClose={2000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          transition={Slide}
        />
        <div className={styles.inner_container}>
          <Sidebar />
          <SideTrack />
          <div className={styles.children_container}>{children}</div>
        </div>
      </div>
    </ClarityWrapper>
  );
};

export default SmallLayout;
