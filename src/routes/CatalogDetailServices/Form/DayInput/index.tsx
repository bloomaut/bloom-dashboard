import styles from "./styles.module.scss";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useEffect } from "react";

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
  action: "post" | "put";
  formData: FormData;
  handleChange: (name: string, value: Date | null) => void;
  errors: { [key: string]: string | undefined };
  checkValidation: boolean;
}

const DayInput = ({ formData, handleChange, errors, checkValidation, action }: DayInputProps) => {
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

  const initializeActiveDays = () => {
    return days.reduce<{ [key: string]: boolean }>((acc, day) => {
      const hasData = formData.data[day.from] || formData.data[day.to];
      acc[day.label.toLowerCase()] = action === "put" ? Boolean(hasData) : true;
      return acc;
    }, {});
  };

  const [activeDays, setActiveDays] = useState<{ [key: string]: boolean }>(initializeActiveDays);

  const toggleDay = (day: string) => {
    setActiveDays(prevState => {
      const isActive = !prevState[day];
      if (!isActive) {
        handleChange(day + "From", null);
        handleChange(day + "To", null);
      }
      return { ...prevState, [day]: isActive };
    });
  };

  const ErrorMessage = ({ error, name }: { error: string | undefined; name?: string }) => {
    const errorClass = name?.startsWith("lunch") ? styles.error_lunchFrom : styles.error;

    return <p className={errorClass ? errorClass : styles.error_hidden}>{error}</p>;
  };

  const parseTime = (value: string | undefined) => {
    if (!value || value.trim() === "") return null;
    const [hours, minutes, seconds] = value.split(":").map(num => parseInt(num, 10));
    return new Date(1970, 0, 1, hours, minutes, seconds);
  };

  useEffect(() => {
    setActiveDays(initializeActiveDays());
  }, [formData, action]);

  return (
    <div className={styles.days_container}>
      {days.map((day, index) => {
        const dayKey = day.label.toLowerCase();
        const isActive = activeDays[dayKey];
        const isSunday = day.label === dict("days.sunday");

        return (
          <div key={index} className={`${styles.box} ${!isActive ? `${styles.box} ${styles.box_disabled}` : ""}`}>
            <div className={styles.day_container} onClick={() => !isSunday && toggleDay(dayKey)}>
              <span className={`${styles.day_active} ${!isActive ? styles.day_disabled : ""}`}>{day.label}</span>
            </div>
            {isActive && !isSunday && (
              <div className={styles.availability}>
                <div className={styles.from}>
                  <DatePicker
                    selected={parseTime(formData.data[day.from]) || null}
                    onChange={(date: Date | null) => handleChange(day.from, date)}
                    className={styles["custom-datepicker"]}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    timeCaption='Time'
                    dateFormat='HH:mm:ss'
                    placeholderText={dict("services.from")}
                  />
                  {checkValidation && <ErrorMessage error={errors[day.from]} name='lunch' />}
                </div>
                <div className={styles.to}>
                  <DatePicker
                    selected={parseTime(formData.data[day.to]) || null}
                    onChange={(date: Date | null) => handleChange(day.to, date)}
                    className={styles["custom-datepicker"]}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    timeCaption='Time'
                    dateFormat='HH:mm:ss'
                    placeholderText={dict("services.to")}
                  />
                  {checkValidation && <ErrorMessage error={errors[day.to]} name='lunch' />}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DayInput;
