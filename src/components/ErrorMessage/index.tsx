"use client";
import styles from "./styles.module.scss";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

const ErrorMessage = ({ error, reset }: { error: Error; reset: () => void }) => {
  const dict = useTranslations("dict.error");

  useEffect(() => {
    console.log(error);
  }, [error]);

  return (
    <div className={styles.container}>
      <p>{dict("message")}</p>
      <button onClick={() => reset()}>{dict("btn")}</button>
    </div>
  );
};

export default ErrorMessage;
