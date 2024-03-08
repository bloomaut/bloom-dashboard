"use client";
import "@/styles/globals.scss";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "@/components/Navbar";
import styles from "./styles.module.scss";
import { ToastContainer } from "react-toastify";
import { Slide } from "react-toastify";

const PlaygroundLayout = ({ children }: { children: React.ReactNode }) => {
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
      <div className={styles.children_container}>{children}</div>
    </div>
  );
};

export default PlaygroundLayout;
