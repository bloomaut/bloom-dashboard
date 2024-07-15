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

      if (fieldsToValidate?.includes("category_name")) {
        if (!formData?.category_name || !formData?.category_name.trim()) {
          errors.category_name = "Debes ingresar un nombre para el catálogo";
        }
      }

      if (fieldsToValidate?.includes("name")) {
        if (!formData?.name || !formData?.name.trim()) {
          errors.name = "Debes ingresar un nombre";
        }
      }

      if (fieldsToValidate?.includes("lastname")) {
        if (!formData?.lastname || !formData?.lastname.trim()) {
          errors.lastname = "Debes ingresar un apellido";
        }
      }

      if (fieldsToValidate?.includes("business_name")) {
        if (!formData?.business_name || !formData?.business_name.trim()) {
          errors.business_name = "Debes ingresar el nombre del negocio";
        }
      }

      if (fieldsToValidate?.includes("business_description")) {
        if (!formData?.business_description || !formData?.business_description.trim()) {
          errors.business_description = "Debes ingresar una descripción para el negocio";
        }
      }

      setErrors(errors);
    };

    validateFormData();
  }, [formData, file]);

  return errors;
};

export default useFormValidator;
