import { useFAQContext } from "@/context/FAQContext";
import styles from "./styles.module.scss";
import Title from "@/components/Title";
import LoadingSpinner from "@/components/Loading";
import FAQForm from "../FAQForm";

const FAQsContainer = () => {
  const { faqs, setFaqs, loading } = useFAQContext();

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
      {loading ? (
        <div className={styles.spinner_container}>
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <hr className={styles.hr}></hr>
          {faqs.map((f, i) => (
            <FAQForm _id={f._id} faq={f} key={i}></FAQForm>
          ))}
        </>
      )}
    </div>
  );
};

export default FAQsContainer;
