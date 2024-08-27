import { DataItemsList } from "@/typescript/interfaces/catalog.interface";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

interface FormDataProps {
  [key: string]: any | undefined;
}

export interface FormErrorsProps {
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
    const errors: FormErrorsProps = {};

    const validateRequiredField = (field: string, errorMessageKey: string) => {
      if (!formData?.[field] || !formData?.[field].trim()) {
        errors[field] = dict(errorMessageKey);
      }
    };

    const validateEmailField = (field: string, errorMessageKeys: [string, string]) => {
      const email = formData?.[field];
      if (!email || !email.trim()) {
        errors[field] = dict(errorMessageKeys[0]);
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors[field] = dict(errorMessageKeys[1]);
      }
    };

    const validatePositiveNumberField = (field: string, errorMessageKey: string) => {
      if (formData?.[field] === undefined || formData?.[field] <= 0) {
        errors[field] = dict(errorMessageKey);
      }
    };

    const validateFromToFields = (fromField: string, toField: string) => {
      if (formData?.data?.[fromField] && !formData?.data?.[toField]) {
        errors[toField] = dict("catalog.services.required.from_error");
      } else if (!formData?.data?.[fromField] && formData?.data?.[toField]) {
        errors[fromField] = dict("catalog.services.required.to_error");
      }
    };

    // Validate specific fields
    if (fieldsToValidate?.includes("ClientFirstname")) {
      validateRequiredField("ClientFirstname", "form_validation.ClientFirstname");
    }

    if (fieldsToValidate?.includes("ClientEmail")) {
      validateEmailField("ClientEmail", ["form_validation.ClientEmail_01", "form_validation.ClientEmail_02"]);
    }

    if (fieldsToValidate?.includes("listname")) {
      validateRequiredField("listname", "form_validation.listname");
    }

    if (fieldsToValidate?.includes("listprice")) {
      validatePositiveNumberField("listprice", "form_validation.listprice");
    }

    if (fieldsToValidate?.includes("category_name")) {
      validateRequiredField("category_name", "form_validation.category_name");
    }

    if (fieldsToValidate?.includes("name")) {
      validateRequiredField("name", "form_validation.name");
    }

    if (fieldsToValidate?.includes("lastname")) {
      validateRequiredField("lastname", "form_validation.lastname");
    }

    if (fieldsToValidate?.includes("business_name")) {
      validateRequiredField("client.name", "form_validation.business_name");
    }

    if (fieldsToValidate?.includes("business_category")) {
      validateRequiredField("client.category", "form_validation.business_category");
    }

    if (fieldsToValidate?.includes("business_description")) {
      validateRequiredField("client.description", "form_validation.business_description");
    }

    if (fieldsToValidate?.includes("serviceName")) {
      validateRequiredField("serviceName", "catalog.services.required.serviceName");
    }

    if (fieldsToValidate?.includes("serviceDescr")) {
      validateRequiredField("serviceDescr", "catalog.services.required.serviceDescr");
    }

    if (fieldsToValidate?.includes("servicePrice")) {
      validatePositiveNumberField("servicePrice", "catalog.services.required.servicePrice");
    }

    if (fieldsToValidate?.includes("serviceImage")) {
      if (!file && !formData?.data?.serviceImage) {
        errors.serviceImage = dict("catalog.services.required.serviceImage");
      }
    }

    // Validate "lunch" fields
    if (fieldsToValidate?.includes("lunchFrom") && fieldsToValidate?.includes("lunchTo")) {
      validateFromToFields("lunchFrom", "lunchTo");
    }

    // Validate duration and simultaneous fields
    if (fieldsToValidate?.includes("duration")) {
      validatePositiveNumberField("duration", "catalog.services.required.duration");
    }

    if (fieldsToValidate?.includes("simultaneous")) {
      validatePositiveNumberField("simultaneous", "catalog.services.required.simultaneous");
    }

    // Validate working days fields
    const daysAndLunchFields = ["lunch", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    daysAndLunchFields.forEach(day => {
      validateFromToFields(`${day}From`, `${day}To`);
    });

    setErrors(errors);
  }, [formData, fieldsToValidate, file, dict]);

  return errors;
};

export default useFormValidator;
