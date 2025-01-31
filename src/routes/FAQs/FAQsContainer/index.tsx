import { useState } from "react";
import { useFAQContext } from "@/context/FAQContext";
import styles from "./styles.module.scss";
import Title from "@/components/Title";
import LoadingSpinner from "@/components/Loading";
import FAQForm from "../FAQForm";
import Icon from "@/components/Icon";

const FAQsContainer = () => {
  const [showExtraFAQ, setShowExtraFAQ] = useState<number>();
  const { faqs, setFaqs, loading } = useFAQContext();

  const handleAddFAQ = () => {
    setFaqs(prev => [
      ...prev,
      {
        _id: "",
        tempKey: Date.now().toString(),
        question: "",
        answer: "",
      },
    ]);
  };

  return (
    <div>
      <Title text={"Preguntas Frecuentes"} />
      <p className={styles.subtitle}>
        Complete the fields with frequently asked questions about your business. <br></br>
        Also complete the answers in the best and most accurate way possible.
      </p>
      <br></br>
      <div className={styles.table_header}>
        <p>Questions</p>
        <p>Answers</p>
      </div>
      <hr className={styles.hr}></hr>
      {loading ? (
        <div className={styles.spinner_container}>
          <LoadingSpinner />
        </div>
      ) : (
        <>
          {faqs.map((f, i) => (
            <>
              <FAQForm faq={f} key={f.tempKey || f._id}></FAQForm>
              <hr className={`${styles.hr} ${styles.hr2}`}></hr>
            </>
          ))}
          <div className={styles.btn_container}>
            <button className={styles.btn_add} onClick={handleAddFAQ}>
              <Icon name='add' viewBox='0 0 20 22' width={20} height={20} strokeWidth={1.5} strokeColor='#1D1D1D' />
              Add more
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default FAQsContainer;
