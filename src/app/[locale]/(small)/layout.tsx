"use client";
import "@/styles/globals.scss";
import "react-toastify/dist/ReactToastify.css";
import styles from "./styles.module.scss";
import "./styles.css";
import { ToastContainer } from "react-toastify";
import { Slide } from "react-toastify";
// Components
import Navbar from "@/components/Navbar";
import SideTrack from "@/components/SideTrack";
import { useState } from "react";
import Questionaire from "@/components/Questionaire/Questionaire";
import { Sidebar } from "@/components/v0Components/Sidebar";
import { TutorialProvider } from "@/context/TutorialContext";
import { useAppSelector } from "@/store/hooks";

const SmallLayout = ({ children }: { children: React.ReactNode }) => {
  const [showQuestions, setShowQuestions] = useState(true);
  const user = useAppSelector(state => state.userData);
  return (
    <div className={styles.container}>
      <TutorialProvider>
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
        {false ? (
          <div className={styles.inner_container}>
            <div className={styles.children_container} id='children_container'>
              <Questionaire />
            </div>
          </div>
        ) : (
          <div className={styles.inner_container}>
            <Sidebar />
            <SideTrack />
            <div className={styles.children_container} id='children_container'>
              {children}
            </div>
          </div>
        )}
      </TutorialProvider>
    </div>
  );
};

export default SmallLayout;
