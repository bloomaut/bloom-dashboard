import { DataItemsList } from "@/typescript/interfaces/catalog.interface";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

interface FormDataProps {
  [key: string]: any | undefined;
}

interface FormErrorsProps {
  [key: string]: string;
}

const useFormValidator = (
  formData: DataItemsList | undefined,
  fieldsToValidate?: (keyof FormDataProps)[],
  file?: File | null,
) => {
  const [errors, setErrors] = useState<FormErrorsProps>({});
  const dict = useTranslations("dict");

  useEffect(() => {
    const validateFormData = () => {
      const errors: FormErrorsProps = {};

      if (
        fieldsToValidate?.includes("ClientFirstname") &&
        (!formData?.ClientFirstname || !formData?.ClientFirstname.trim())
      ) {
        errors.ClientFirstname = dict("form_validation.ClientFirstname");
      }

      if (fieldsToValidate?.includes("ClientEmail")) {
        if (!formData?.ClientEmail || !formData?.ClientEmail.trim()) {
          errors.ClientEmail = dict("form_validation.ClientEmail_01");
        } else {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(formData.ClientEmail)) {
            errors.ClientEmail = dict("form_validation.ClientEmail_02");
          }
        }
      }

      if (fieldsToValidate?.includes("listname") && (!formData?.listname || !formData?.listname.trim())) {
        errors.listname = dict("form_validation.listname");
      }

      if (fieldsToValidate?.includes("listprice") && (formData?.listprice === undefined || formData?.listprice <= 0)) {
        errors.listprice = dict("form_validation.listprice");
      }

      setErrors(errors);
    };

    validateFormData();
  }, [formData, file]);

  return errors;
};

export default useFormValidator;
