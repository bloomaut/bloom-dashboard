import styles from "./styles.module.scss";
import MainForm from "./MainForm";
import SecondaryForm from "./SecondaryForm";
import Header from "@/components/Header";
import { useAppSelector } from "@/store/hooks";
import { useState } from "react";
import { UserBusiness } from "@/typescript/interfaces/business.interface";
import { useTranslations } from "next-intl";
import { userInitialState } from "@/store/features/userSlice";
import { useMessageToast } from "@/hooks/useMessageToast";
import useFormValidator from "@/hooks/useFormValidator";
import { handleLogoUpload } from "@/utils/handleLogoUpload";
import { update } from "@/services/fetch";
import { ENV } from "@/typescript/types/api";

const Business = () => {
  const userData = useAppSelector(state => state.userData);
  const [formData, setFormData] = useState<UserBusiness>(userInitialState);
  const [checkValidation, setCheckValidation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [logo, setLogo] = useState<File | null>(null);
  const [banner, setBanner] = useState<File | null>(null);
  const { notify, notifyError } = useMessageToast();
  const fieldsToValidate = ["name", "lastname", "business_name", "business_description"];
  const errors = useFormValidator(formData, fieldsToValidate);
  const dict = useTranslations("dict");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevFormData => {
      if (name.startsWith("business_")) {
        const clientField = name.replace("business_", "");
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
    if (Object.keys(errors).length === 0) {
      setLoading(true);
      let logoURL = "";
      let colors = [];
      if (logo) {
        const data = await handleLogoUpload(logo);
        logoURL = data?.url;
        colors = data?.colors || [];
      }

      const transformedPalette = colors.map((color: string) => ({ color }));

      const dataToSend = {
        userName: formData.name,
        userLastname: formData.lastname,
        clientName: formData.client.name,
        description: formData.client.description,
        website: formData.client.company_web,
        instagram: formData.client.instagram,
        phone: formData.phone,
        logo: logoURL,
        palette: transformedPalette,
      };

      const response = await update("small-business", dataToSend);

      if (response.statusCode === 200) {
        notify(dict("toast.success_edit"));
        setLoading(false);
        setFormData(prevFormData => ({
          ...prevFormData,
          name: dataToSend.userName,
          lastname: dataToSend.userLastname,
          client: {
            ...prevFormData.client,
            name: dataToSend.clientName,
            description: dataToSend.description,
            company_web: dataToSend.website,
            instagram: dataToSend.instagram,
            palette: dataToSend.palette,
          },
          phone: dataToSend.phone,
          logo: dataToSend.logo,
        }));
      } else {
        notifyError(dict("toast.error_edit"));
        setLoading(false);
      }
    }
  };

  return (
    <section className={styles.container_business}>
      <Header title={dict("business.form.title")} subtitle={dict("business.form.subtitle")} />
      <div className={styles.container_columns}>
        <MainForm
          userData={userData}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          onChange={handleChange}
          validation={checkValidation}
          errors={errors}
          loading={loading}
        />
        <SecondaryForm
          logo={logo}
          setLogo={setLogo}
          banner={banner}
          setBanner={setBanner}
          formData={formData}
          setFormData={setFormData}
          onChange={handleChange}
        />
      </div>
    </section>
  );
};

export default Business;
