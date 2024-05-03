import styles from "./styles.module.scss";
import { useTranslations, useLocale } from "next-intl";
// Componentes
import CardSteps from "../CardSteps";
import Button from "@/components/Button";
import { Fade } from "react-awesome-reveal";

interface Steps2Props {
  userStep: number;
}

const Step2 = ({ userStep }: Steps2Props) => {
  const dict = useTranslations("dict.guide.stepper_two");
  const locale = useLocale();

  const handleButtonClick = () => {
    console.log("click");
  };

  return (
    <div className={styles.container}>
      <h1>{dict("title")}</h1>
      <div className={styles.step_container}>
        <Fade cascade damping={0.1} className={styles.fade} triggerOnce>
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
        </Fade>
        <div className={styles.btn_container}>
          <Button
            title={dict("button")}
            onclick={handleButtonClick}
            isDisabled={userStep !== 7 ? true : false}
            styleName={"btn"}
          />
        </div>
      </div>
    </div>
  );
};

export default Step2;
