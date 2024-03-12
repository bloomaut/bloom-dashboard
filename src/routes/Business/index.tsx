"use client";
import Files from "./Files";
import Form from "./Form";
import Sequence from "./Sequence";
import styles from "./styles.module.scss";

const Business = () => {
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
