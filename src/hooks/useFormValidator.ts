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

      if (fieldsToValidate?.includes("listname") && (!formData?.data?.listname || !formData?.data?.listname.trim())) {
        errors.listname = dict("form_validation.listname");
      }

      if (
        fieldsToValidate?.includes("listprice") &&
        (formData?.data?.listprice === undefined || formData?.data?.listprice <= 0)
      ) {
        errors.listprice = dict("form_validation.listprice");
      }

      if (fieldsToValidate?.includes("category_name")) {
        if (!formData?.category_name || !formData?.category_name.trim()) {
          errors.category_name = dict("form_validation.category_name");
        }
      }

      if (fieldsToValidate?.includes("name")) {
        if (!formData?.name || !formData?.name.trim()) {
          errors.name = dict("form_validation.name");
        }
      }

      if (fieldsToValidate?.includes("lastname")) {
        if (!formData?.lastname || !formData?.lastname.trim()) {
          errors.lastname = dict("form_validation.lastname");
        }
      }

      if (fieldsToValidate?.includes("business_name")) {
        if (!formData?.client.name || !formData?.client.name.trim()) {
          errors.business_name = dict("form_validation.business_name");
        }
      }

      if (fieldsToValidate?.includes("business_category")) {
        if (
          !formData?.client.category ||
          typeof formData?.client.category !== "string" ||
          !formData?.client.category.trim()
        ) {
          errors.business_category = dict("form_validation.business_category");
        }
      }

      if (fieldsToValidate?.includes("business_description")) {
        if (!formData?.client.description || !formData?.client.description.trim()) {
          errors.business_description = dict("form_validation.business_description");
        }
      }

      if (fieldsToValidate?.includes("serviceName")) {
        if (!formData?.data?.serviceName || !formData?.data?.serviceName.trim()) {
          errors.serviceName = dict("catalog.services.required.serviceName");
        }
      }

      if (fieldsToValidate?.includes("serviceDescr")) {
        if (!formData?.data?.serviceDescr || !formData?.data?.serviceDescr.trim()) {
          errors.serviceDescr = dict("catalog.services.required.serviceDescr");
        }
      }

      if (fieldsToValidate?.includes("servicePrice")) {
        if (formData?.data?.servicePrice === null || formData?.data?.servicePrice <= 0) {
          errors.servicePrice = dict("catalog.services.required.servicePrice");
        }
      }

      if (fieldsToValidate?.includes("serviceImage")) {
        if (!file && !formData?.data?.serviceImage) {
          errors.serviceImage = dict("catalog.services.required.serviceImage");
        }
      }

      if (fieldsToValidate?.includes("lunchFrom") && fieldsToValidate?.includes("lunchTo")) {
        const lunchFrom = formData?.data?.lunchFrom;
        const lunchTo = formData?.data?.lunchTo;

        if (lunchFrom && !lunchTo) {
          errors.lunchTo = dict("catalog.services.required.lunchTo");
        } else if (!lunchFrom && lunchTo) {
          errors.lunchFrom = dict("catalog.services.required.lunchFrom");
        } else if (!lunchFrom && !lunchTo) {
          errors.lunchFrom = dict("catalog.services.required.lunchFrom");
          errors.lunchTo = dict("catalog.services.required.lunchTo");
        }
      }

      if (fieldsToValidate?.includes("duration")) {
        const duration = formData?.data?.duration;
        if (duration === null || duration === "" || duration <= 0) {
          errors.duration = dict("catalog.services.required.duration");
        }
      }

      if (fieldsToValidate?.includes("simultaneous")) {
        const simultaneous = formData?.data?.simultaneous;
        if (simultaneous === null || simultaneous === "" || simultaneous <= 0) {
          errors.simultaneous = dict("catalog.services.required.simultaneous");
        }
      }

      const daysAndLunchFields = [
        "lunch",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ];

      daysAndLunchFields.forEach(day => {
        const fromField = `${day}From`;
        const toField = `${day}To`;

        if (
          fieldsToValidate?.includes(fromField as keyof FormDataProps) ||
          fieldsToValidate?.includes(toField as keyof FormDataProps)
        ) {
          if (formData?.data[fromField] && !formData?.data[toField]) {
            errors[toField] = dict("catalog.services.required.from_error");
          } else if (!formData?.data[fromField] && formData?.data[toField]) {
            errors[fromField] = dict("catalog.services.required.to_error");
          }
        }
      });

      setErrors(errors);
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
