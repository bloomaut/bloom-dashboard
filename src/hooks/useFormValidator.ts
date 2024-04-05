import { useEffect, useState } from "react";

interface FormDataProps {
  ClientFirstname: string;
  ClientLastname: string;
  ClientEmail: string;
  ClientLocation: string;
  ClientPhone: string;
  personalNote: string;
}

interface FormErrorsProps {
  ClientFirstname?: string;
  ClientLastname?: string;
  ClientEmail?: string;
  ClientLocation?: string;
  ClientPhone?: string;
  personalNote?: string;
}

const useFormValidator = (formData: FormDataProps) => {
  const [errors, setErrors] = useState<FormErrorsProps>({});

  useEffect(() => {
    const validateFormData = () => {
      const errors: FormErrorsProps = {};

      if (!formData.ClientFirstname.trim()) {
        errors.ClientFirstname = "Nombre es requerido";
      }

      if (formData.ClientEmail.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.ClientEmail)) {
          errors.ClientEmail = "Formato de email inválido";
        }
      }

      setErrors(errors);
    };

    validateFormData();
  }, [formData]);

  return errors;
};

export default useFormValidator;
