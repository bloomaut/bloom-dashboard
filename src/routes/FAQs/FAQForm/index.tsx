import { useFAQContext } from "@/context/FAQContext";
import styles from "./styles.module.scss";
import { FAQ } from "@/typescript/interfaces/faq.interface";

interface Props {
  _id: string | "new-faq";
  faq: FAQ;
}

const FAQForm = ({ faq }: Props) => {
  const { setFaqs } = useFAQContext();

  return <div>{faq.question}</div>;
};

export default FAQForm;
