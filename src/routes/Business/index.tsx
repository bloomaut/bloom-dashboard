import styles from "./styles.module.scss";
import MainForm from "./MainForm";
import SecondaryForm from "./SecondaryForm";
import Header from "@/components/Header";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect, useState } from "react";
import { UserBusiness } from "@/typescript/interfaces/business.interface";
import { useTranslations } from "next-intl";
import { userInitialState } from "@/store/features/userSlice";
import { useMessageToast } from "@/hooks/useMessageToast";
import useFormValidator from "@/hooks/useFormValidator";
import { handleLogoUpload } from "@/utils/handleLogoUpload";
import { update } from "@/services/fetch";
import { setUserData } from "@/store/features/userSlice";
import { handleLogoBanner } from "@/utils/handleUploadBanner";
import { useRef } from "react";

const initialFormData: UserBusiness = {
  name: "",
  lastname: "",
  client: {
    name: "",
    description: "",
    category: "",
    logo: "",
    banner: "",
    palette: [{ color: "#ffffff" }],
    company_web: "",
    instagram: "",
  },
  phone: "",
};

const Business = () => {
  const userData = useAppSelector(state => state.userData);
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<UserBusiness>(userInitialState);
  const [checkValidation, setCheckValidation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [logo, setLogo] = useState<File | null>(null);
  const [banner, setBanner] = useState<File | null>(null);
  const [errorLogo, setErrorLogo] = useState(false);
  const { notify, notifyError } = useMessageToast();
  const fieldsToValidate = ["name", "lastname", "business_name", "business_category", "business_description"];
  const errors = useFormValidator(formData, fieldsToValidate);
  const dict = useTranslations("dict");
  const formRef = useRef<HTMLFormElement>(null);
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

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      client: {
        ...prevFormData.client,
        category: e.target.value,
      },
    }));
  };

  const validateLogo = () => {
    return Boolean(logo) || Boolean(formData.client.logo);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCheckValidation(true);
    const logoExists = validateLogo();
    if (Object.keys(errors).length === 0 && logoExists) {
      setLoading(true);
      setCheckValidation(false);
      setErrorLogo(false);

      const dataToSend = {
        userName: formData.name,
        userLastname: formData.lastname,
        clientName: formData.client.name,
        category: formData.client.category,
        description: formData.client.description,
        website: formData.client.company_web,
        instagram: formData.client.instagram,
        phone: formData.phone,
        logo: formData.client.logo,
        palette: formData.client.palette,
      };

      const response = await update("small-business", dataToSend);
      console.log(response, "res");
      if (response.statusCode === 200) {
        notify(dict("toast.success_edit"));
        setLoading(false);
        dispatch(
          setUserData({
            name: dataToSend.userName,
            lastname: dataToSend.userLastname,
            client: {
              name: dataToSend.clientName,
              category: dataToSend.category,
              description: dataToSend.description,
              logo: dataToSend.logo,
              banner: formData.client.banner,
              palette: dataToSend.palette,
              company_web: dataToSend.website,
              instagram: dataToSend.instagram,
            },
            phone: dataToSend.phone,
          }),
        );
      } else {
        notifyError(dict("toast.error_edit"));
        setLoading(false);
      }
    } else {
      setErrorLogo(!validateLogo());
    }
  };

  useEffect(() => {
    if (userData.name !== "") {
      setFormData(userData);
    } else {
      setFormData(initialFormData);
    }
  }, [userData]);

  useEffect(() => {
    if (logo || formData.client.logo) {
      setErrorLogo(false);
    }
  }, [logo, formData.client.logo]);

  useEffect(() => {
    const uploadLogo = async () => {
      if (logo) {
        const data = await handleLogoUpload(logo);
        const logoURL = data?.url || "";
        const colors = data?.colors || [];
        const parsedPalette = colors.map((color: string) => ({ color }));

        setFormData(prevFormData => ({
          ...prevFormData,
          client: {
            ...prevFormData.client,
            logo: logoURL,
            palette: parsedPalette,
          },
        }));
      }
    };

    uploadLogo();
  }, [logo]);

  useEffect(() => {
    const uploadBanner = async () => {
      if (banner) {
        const bannerUrl = await handleLogoBanner(banner);
        setFormData(prevFormData => ({
          ...prevFormData,
          client: {
            ...prevFormData.client,
            banner: bannerUrl,
          },
        }));
      }
    };

    uploadBanner();
  }, [banner]);

  return (
    <section className={styles.container_business}>
      <Header title={dict("business.form.title")} subtitle={dict("business.form.subtitle")} />
      <div className={styles.container_columns}>
        <MainForm
          formData={formData}
          onSubmit={handleSubmit}
          onChange={handleChange}
          validation={checkValidation}
          errors={errors}
          loading={loading}
          onCategoryChange={handleCategoryChange}
          formRef={formRef}
        />
        <SecondaryForm
          logo={logo}
          setLogo={setLogo}
          errorLogo={errorLogo}
          banner={banner}
          setBanner={setBanner}
          formData={formData}
          setFormData={setFormData}
          onChange={handleChange}
          formValidate={Object.keys(errors).length === 0}
          loading={loading}
          formRef={formRef}
        />
      </div>
    </section>
  );
};

export default Business;
