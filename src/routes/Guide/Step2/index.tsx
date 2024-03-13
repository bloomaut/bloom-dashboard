import styles from "./styles.module.scss";
import { useTranslations, useLocale } from "next-intl";
import { useState, useEffect } from "react";
import CardSteps from "../CardSteps";
import Button from "@/components/Button";

interface Steps2Props {
  userStep: number;
}

const Step2 = ({ userStep }: Steps2Props) => {
  const dict = useTranslations("dict.guide.stepper_two");
  const locale = useLocale();
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const handleButtonClick = () => {
    setIsButtonDisabled(false);
  };

  useEffect(() => {
    setIsButtonDisabled(userStep !== 7);
  }, [userStep]);

  return (
    <div className={styles.container}>
      <h1>{dict("title")}</h1>
      <div className={styles.step_container}>
        <CardSteps
          step_number={5}
          title={dict("title_one")}
          subtitle={dict("subtitle_one")}
          isActive={userStep >= 5}
          linkTo={`/${locale}/`}
        />
        <CardSteps
          step_number={6}
          title={dict("title_two")}
          subtitle={dict("subtitle_two")}
          isActive={userStep >= 6}
          linkTo={`/${locale}/`}
        />
        <CardSteps
          step_number={7}
          title={dict("title_three")}
          subtitle={dict("subtitle_three")}
          isActive={userStep >= 7}
          linkTo={`/${locale}/`}
        />
        <div className={styles.btn_container}>
          <Button
            title={dict("button")}
            onclick={handleButtonClick}
            isDisabled={isButtonDisabled}
            styleName={isButtonDisabled ? "btn_disabled_sequence" : "btn_outlined"}
          />
        </div>
      </div>
    </div>
  );
};

export default Step2;
