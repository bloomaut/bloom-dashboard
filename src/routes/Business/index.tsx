import styles from "./styles.module.scss";
import MainForm from "./MainForm";
import SecondaryForm from "./SecondaryForm";
import Header from "@/components/Header";
import { useAppSelector } from "@/store/hooks";
import { useEffect, useState } from "react";
import { UserBusiness } from "@/typescript/interfaces/business.interface";
import { useTranslations } from "next-intl";
import { userInitialState } from "@/store/features/userSlice";
import { useMessageToast } from "@/hooks/useMessageToast";
import useFormValidator from "@/hooks/useFormValidator";

const Business = () => {
  const userData = useAppSelector(state => state.userData);
  const [formData, setFormData] = useState<UserBusiness>(userInitialState);
  const [checkValidation, setCheckValidation] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { notify, notifyError } = useMessageToast();
  const dict = useTranslations("dict.business.form");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevFormData => {
      if (name.startsWith("business.")) {
        const clientField = name.replace("business.", "");
        return {
          ...prevFormData,
          client: {
            ...prevFormData.client,
            [clientField]: value,
          },
        };
      }
      return {
        ...prevFormData,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCheckValidation(true);
    const errors = useFormValidator(formData, ["category_name"], file);
    if (Object.keys(errors).length === 0) {
      notify(dict("messages.success"));
    } else {
      notifyError(dict("messages.error"));
    }
  };

  return (
    <section className={styles.container_business}>
      <Header title={dict("title")} subtitle={dict("subtitle")} />
      <div className={styles.container_columns}>
        <MainForm
          userData={userData}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          onChange={handleChange}
          validation={checkValidation}
        />
        <SecondaryForm
          logo={formData.client.logo}
          banner={formData.client.banner}
          palette={formData.client.palette}
          website={formData.client.company_web}
          instagram={formData.client.instagram}
          phone={formData.phone}
        />
      </div>
    </section>
  );
};

export default Business;
