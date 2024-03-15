"use client";
import styles from "./styles.module.scss";
import "@/styles/theme.scss";
import { ThreeDots } from "react-loader-spinner";

const LoadingDots = () => {
  return (
    <div className={styles.container}>
      <div className={styles.loadingWrapper}>
        <ThreeDots
          visible={true}
          height='20'
          width='20'
          color='$lighterGrey'
          radius='9'
          ariaLabel='three-dots-loading'
          wrapperStyle={{}}
          wrapperClass=''
        />
        <p>Escribiendo...</p>
      </div>
    </div>
  );
};

export default LoadingDots;
