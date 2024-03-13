"use client";
import Files from "./Files";
import Form from "./Form";
import Sequence from "./Sequence";
import styles from "./styles.module.scss";
import { useState, useEffect } from "react";
import { get } from "@/services/fetch";

const Business = () => {
  useEffect(() => {
    const handleFetch = async () => {
      try {
        const response = await get("small-business/me", "NEXT_PUBLIC_API_DASH");
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };

    handleFetch();
  }, []);

  return (
    <section className={styles.container}>
      <div className={styles.inner_container}>
        <Form />
        <Files />
        <Sequence />
      </div>
    </section>
  );
};

export default Business;
