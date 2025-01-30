import { useState, useEffect } from "react";
import { useFAQContext } from "@/context/FAQContext";
import styles from "./styles.module.scss";
import { FAQ } from "@/typescript/interfaces/faq.interface";
import { remove } from "@/services/fetch";
import { useMessageToast } from "@/hooks/useMessageToast";
import { ENV } from "@/typescript/types/api";

import Button from "@/components/Button";
import Icon from "@/components/Icon";

const initialFormData = {
  question: '',
  answer: '',
}

interface Props {
  _id: string | "new-faq";
  faq: FAQ;
}

const FAQForm = ({ _id, faq }: Props) => {
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState<boolean>(false);
  const { notify } = useMessageToast();
  const { setFaqs } = useFAQContext();

  useEffect(() => {
    setFormData({
      question: faq.question,
      answer: faq.answer,
    });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    if (_id === "new-faq") {
      // POST 
    } else {
      // UPDATE
    }
  }

  const handleDelete = async (e: React.FormEvent) => {
    const del = confirm('Do you want to delete this FAQ?');
    if (del) {
      await remove(`/small-faq`, _id, ENV.BOX);
      notify('Successfully deleted FAQ');
    }
  }

  return (
    <div>
      <form className={styles.form}>
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
          <textarea
            name='answer'
            value={formData.answer}
            onChange={handleChange}
            placeholder='Answer'
          ></textarea>
        </div>
        <div>
          <Button
            title={""}
            icon={<Icon name='delete' width={24} height={24} strokeColor='#7f7f7f' viewBox='0 0 23 26' />}
            styleName='btn_delete_business'
            onclick={() => handleDelete}
          />
          <Button
            title={"Save"}
            styleName=''
            onclick={() => handleCreateOrUpdate}
          />
        </div>
      </form>
    </div>
  );
};

export default FAQForm;
