import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

interface FormDataProps {
  ClientFirstname?: string;
  ClientLastname?: string;
  ClientEmail?: string;
  ClientLocation?: string;
  ClientPhone?: string;
  personalNote?: string;
  listname?: string;
  listdescr?: string;
  listimage?: string;
  listprice?: number;
}

interface FormErrorsProps {
  ClientFirstname?: string;
  ClientLastname?: string;
  ClientEmail?: string;
  ClientLocation?: string;
  ClientPhone?: string;
  personalNote?: string;
  listname?: string;
  listdescr?: string;
  listimage?: string;
  listprice?: string;
}

const useFormValidator = (formData: FormDataProps, file?: File | null) => {
  const [errors, setErrors] = useState<FormErrorsProps>({});
  const dict = useTranslations("dict");

  useEffect(() => {
    const validateFormData = () => {
      const errors: FormErrorsProps = {};

      if (formData.ClientFirstname === undefined || !formData.ClientFirstname.trim()) {
        errors.ClientFirstname = dict("form_validation.ClientFirstname");
      }

      if (formData.ClientEmail === undefined || !formData.ClientEmail.trim()) {
        errors.ClientEmail = dict("form_validation.ClientEmail_01");
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.ClientEmail)) {
          errors.ClientEmail = dict("form_validation.ClientEmail_02");
        }
      }

      if (formData.listname === undefined || !formData.listname.trim()) {
        errors.listname = dict("form_validation.listname");
      }

      if (formData.listdescr === undefined || !formData.listdescr.trim()) {
        errors.listdescr = dict("form_validation.listdescr");
      }

      if (formData.listprice === undefined || formData.listprice <= 0) {
        errors.listprice = dict("form_validation.listprice");
      }

      if (!file) {
        errors.listimage = dict("form_validation.listimage");
      }

      setErrors(errors);
    };

    validateFormData();
  }, [formData, file]);

  return errors;
};

export default useFormValidator;
