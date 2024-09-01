import Input from "@/components/Input";
import styles from "./styles.module.scss";
import { useTranslations } from "next-intl";

interface FormData {
  data: {
    mondayFrom?: string;
    mondayTo?: string;
    tuesdayFrom?: string;
    tuesdayTo?: string;
    wednesdayFrom?: string;
    wednesdayTo?: string;
    thursdayFrom?: string;
    thursdayTo?: string;
    fridayFrom?: string;
    fridayTo?: string;
    saturdayFrom?: string;
    saturdayTo?: string;
    sundayFrom?: string;
    sundayTo?: string;
  };
}

interface DayInputProps {
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  errors: { [key: string]: string | undefined };
  checkValidation: boolean;
}

const DayInput = ({ formData, handleChange, errors, checkValidation }: DayInputProps) => {
  const dict = useTranslations("dict.catalog");

  const days: { label: string; from: keyof FormData["data"]; to: keyof FormData["data"] }[] = [
    { label: dict("days.monday"), from: "mondayFrom", to: "mondayTo" },
    { label: dict("days.tuesday"), from: "tuesdayFrom", to: "tuesdayTo" },
    { label: dict("days.wednesday"), from: "wednesdayFrom", to: "wednesdayTo" },
    { label: dict("days.thursday"), from: "thursdayFrom", to: "thursdayTo" },
    { label: dict("days.friday"), from: "fridayFrom", to: "fridayTo" },
    { label: dict("days.saturday"), from: "saturdayFrom", to: "saturdayTo" },
    { label: dict("days.sunday"), from: "sundayFrom", to: "sundayTo" },
  ];

  const ErrorMessage = ({ error, name }: { error: string | undefined; name?: string }) => {
    const errorClass = name?.startsWith("lunch") ? styles.error_lunchFrom : styles.error;

    return <p className={errorClass ? errorClass : styles.error_hidden}>{error}</p>;
  };

  return (
    <div className={styles.days_container}>
      {days.map((day, index) => (
        <div key={index} className={styles.box}>
          <div className={styles.day_container}>
            <span className={styles.day}>{day.label}</span>
          </div>
          <div className={styles.availability}>
            <div className={styles.from}>
              <Input
                type='number'
                textLabel={dict("services.from")}
                textHolder='00:00'
                name={day.from}
                value={formData.data?.[day.from] ?? ""}
                handleChange={handleChange}
              />
              {checkValidation && <ErrorMessage error={errors[day.from]} name='lunch' />}
            </div>
            <div className={styles.to}>
              <Input
                type='number'
                textLabel={dict("services.to")}
                textHolder='00:00'
                name={day.to}
                value={formData.data?.[day.to] ?? ""}
                handleChange={handleChange}
              />
              {checkValidation && <ErrorMessage error={errors[day.to]} name='lunch' />}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DayInput;
