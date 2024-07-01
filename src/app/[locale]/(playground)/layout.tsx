"use client";
import "@/styles/globals.scss";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "@/components/Navbar";
import styles from "./styles.module.scss";
import { ToastContainer } from "react-toastify";
import { Slide } from "react-toastify";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";

const PlaygroundLayout = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const { user } = useUser();

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
        {user && <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />}
        <div
          className={`${styles.children_container} ${isOpen && styles.not_user} ${user && styles.children_container_closed}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default PlaygroundLayout;
