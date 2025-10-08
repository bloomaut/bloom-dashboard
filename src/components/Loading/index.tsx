"use client";
import styles from "./styles.module.scss";
import { Oval } from "react-loader-spinner";
import ReactDOM from "react-dom";

const LoadingSpinner = ({ home = false }: { home?: boolean }) => {
  const isClient = typeof window !== "undefined";

  if (!isClient) {
    return <div style={{ display: "none" }} />;
  }

  return ReactDOM.createPortal(
    <div className={home ? `${styles.loadingWrapper} ${styles.loadingHome}` : `${styles.loadingWrapper}`}>
      <Oval
        height={50}
        width={50}
        color='#ff3d02'
        wrapperStyle={{}}
        wrapperClass=''
        visible={true}
        ariaLabel='oval-loading'
        secondaryColor='#ffc8b8'
        strokeWidth={2}
        strokeWidthSecondary={2}
      />
    </div>,
    document.body,
  );
};

export default LoadingSpinner;
