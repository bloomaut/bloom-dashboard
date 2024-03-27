"use client";
import "@/styles/globals.scss";
import styles from "./styles.module.scss";
import { ToastContainer } from "react-toastify";
import { Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

const SmallLayout = ({ children }: { children: React.ReactNode }) => {
  return (
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
        <div className={styles.children_container}>{children}</div>
      </div>
    </div>
  );
};

export default SmallLayout;
