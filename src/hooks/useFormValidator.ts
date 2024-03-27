import { useEffect, useState } from "react";

interface FormDataProps {
  ClientFirstname: string;
  ClientLastname: string;
  ClientEmail: string;
  ClientLocation: string;
  ClientPhone: string;
  note?: string;
}

interface FormErrorsProps {
  ClientFirstname?: string;
  ClientLastname?: string;
  ClientEmail?: string;
  ClientLocation?: string;
  ClientPhone?: string;
  note?: string;
}

const useFormValidator = (formData: FormDataProps) => {
  const [errors, setErrors] = useState<FormErrorsProps>({});

  useEffect(() => {
    const validateFormData = () => {
      const errors: FormErrorsProps = {};

      if (!formData.ClientFirstname.trim()) {
        errors.ClientFirstname = "Nombre es requerido";
      }

      if (!formData.ClientLastname.trim()) {
        errors.ClientLastname = "Apellido es requerido";
      }

      if (!formData.ClientEmail.trim()) {
        errors.ClientEmail = "Email es requerido";
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.ClientEmail)) {
          errors.ClientEmail = "Formato de email inválido";
        }
      }

      if (!formData.ClientLocation.trim()) {
        errors.ClientLocation = "Ubicación es requerida";
      }

      if (!formData.ClientPhone.trim()) {
        errors.ClientPhone = "Teléfono es requerido";
      }

      setErrors(errors);
    };

    validateFormData();
  }, [formData]);

  return errors;
};

export default useFormValidator;
