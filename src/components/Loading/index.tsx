"use client";
import styles from "./styles.module.scss";
import { Oval } from "react-loader-spinner";

const LoadingSpinner = ({ home = false }: { home?: boolean }) => {
  return (
    <div className={home ? `${styles.loadingWrapper} ${styles.loadingHome}` : `${styles.loadingWrapper}`}>
      <Oval
        height={50}
        width={50}
        color='#5282fd'
        wrapperStyle={{}}
        wrapperClass=''
        visible={true}
        ariaLabel='oval-loading'
        secondaryColor='#5551f3'
        strokeWidth={2}
        strokeWidthSecondary={2}
      />
    </div>
  );
};

export default LoadingSpinner;
