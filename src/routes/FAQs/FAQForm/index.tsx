import { useState, useEffect } from "react";
import { useFAQContext } from "@/context/FAQContext";
import styles from "./styles.module.scss";
import { FAQ } from "@/typescript/interfaces/faq.interface";
import { post, update, remove } from "@/services/fetch";
import { useMessageToast } from "@/hooks/useMessageToast";
import { ENV } from "@/typescript/types/api";

import Button from "@/components/Button";
import Icon from "@/components/Icon";

const initialFormData = {
  question: "",
  answer: "",
};

interface Props {
  faq: FAQ;
}

const FAQForm = ({ faq }: Props) => {
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState<boolean>(false);
  const { notify } = useMessageToast();
  const { setFaqs } = useFAQContext();

  useEffect(() => {
    console.log(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!faq._id) {
      // POST
      const data = await post("small-faq", formData, ENV.BOX);
      if (data.data.statusCode === 201) {
        const newFaq = data.data.result.smallFAQ;
        setFaqs(prev => prev.map(f => (f.tempKey === faq.tempKey ? { ...faq, _id: newFaq._id } : f)));
      }
    } else {
      // UPDATE
      const data = await update("small-faq", formData, faq._id, ENV.BOX);
      if (data.statusCode === 200) {
        const faq = data.smallFAQ;
        setFaqs(prev =>
          prev.map(f =>
            f.question === formData.question ? { ...faq, question: faq.question, answer: faq.answer } : f,
          ),
        );
      }
    }
    notify("FAQ saved");
    setLoading(false);
  };

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("_id", faq._id);
    const del = confirm("Do you want to delete this FAQ?");
    if (del) {
      await remove(`/small-faq`, faq._id, ENV.BOX);
      setFaqs(prev => prev.filter(f => f._id !== faq._id));
      notify("Successfully deleted FAQ");
    }
  };

  return (
    <div>
      <form className={styles.form} onSubmit={handleCreateOrUpdate}>
        <div className={styles.input}>
          <input
            type='text'
            name='question'
            value={formData.question}
            onChange={handleChange}
            placeholder='Question'
            required
          />
        </div>
        <div className={styles.input}>
          <textarea name='answer' value={formData.answer} onChange={handleChange} placeholder='Answer'></textarea>
        </div>
        <div>
          <button className={`${styles.btn_del} btn_delete_business`} onClick={handleDelete}>
            <Icon name='delete' width={24} height={24} strokeColor='#7f7f7f' viewBox='0 0 23 26' />
          </button>
          <Button title={"Save"} type='submit' loading={loading} />
        </div>
      </form>
    </div>
  );
};

export default FAQForm;
