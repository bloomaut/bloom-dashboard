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
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Questionaire from "@/components/Questionaire/Questionaire";
import { Sidebar } from "@/components/v0Components/Sidebar";
import { TutorialProvider } from "@/context/TutorialContext";
import { useAppSelector } from "@/store/hooks";

const SmallLayout = ({ children }: { children: React.ReactNode }) => {
  const [showQuestions, setShowQuestions] = useState(true);
  const user = useAppSelector(state => state.userData);
  const router = useRouter();

  useEffect(() => {
    try {
      if (!user) return;
      const roleCandidate = (user as any).role || (user as any)?.client?.role || (user as any)?.user?.role;
      const role = typeof roleCandidate === "string" ? roleCandidate.toLowerCase() : null;
      if (role === "admin") {
        router.replace("/en/backoffice");
      }
    } catch (err) {
      console.error("Error checking user role for redirect:", err);
    }
  }, [user, router]);

  // Show loader while user data is being fetched / not available yet
  const isEmptyUser = !user || (typeof user === "object" && Object.keys(user).length === 0);
  if (isEmptyUser) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          width: "100%",
          background: "var(--color-background, #fff)",
        }}
        aria-busy='true'
        aria-live='polite'
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              border: "4px solid rgba(0,0,0,0.08)",
              borderTopColor: "var(--color-primary, #4dc2f4)",
              animation: "spin 1s linear infinite",
              margin: "0 auto",
            }}
          />
          <div style={{ marginTop: 12, color: "var(--color-font-tertiary, #767676)" }}>Cargando...</div>
        </div>
        <style jsx>{`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className={styles.container} style={{ overflow: "hidden" }}>
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
        {user.client.proposal_status !== "APPROVED" ? (
          <div className={styles.inner_container} style={{ width: "100%" }}>
            <div className={styles.children_container} style={{ width: "100%" }} id='children_container'>
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
