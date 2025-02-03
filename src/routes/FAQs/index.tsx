import { FAQProvider } from "@/context/FAQContext";
import styles from "./styles.module.scss";
import FAQsContainer from "./FAQsContainer";

const FAQs = () => {
  return (
    <FAQProvider>
      <section className={styles.faq_container}>
        <FAQsContainer></FAQsContainer>
      </section>
    </FAQProvider>
  );
};

export default FAQs;
