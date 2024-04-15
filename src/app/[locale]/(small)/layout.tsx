"use client";
import "@/styles/globals.scss";
import styles from "./styles.module.scss";
import { ToastContainer } from "react-toastify";
import { Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useState } from "react";

const SmallLayout = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

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
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
        <div
          className={
            isOpen ? `${styles.children_container}` : `${styles.children_container} ${styles.children_container_closed}`
          }
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default SmallLayout;
