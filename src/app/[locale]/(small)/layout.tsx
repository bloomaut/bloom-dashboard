"use client";
import "@/styles/globals.scss";
import styles from "./styles.module.scss";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { ToastContainer } from "react-toastify";
import { Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
        <div className={styles.children_container}>{children}</div>
      </div>
    </div>
  );
};

export default withPageAuthRequired(SmallLayout);
