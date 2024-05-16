import styles from "./styles.module.scss";
import { useTranslations, useLocale } from "next-intl";
// Componentes
import CardSteps from "../CardSteps";
import { Fade } from "react-awesome-reveal";

interface Steps1Props {
  userStep: number;
}

const Step1 = ({ userStep }: Steps1Props) => {
  const dict = useTranslations("dict.guide.stepper_one");
  const locale = useLocale();

  return (
    <div className={styles.container}>
      <h1>{dict("title")}</h1>
      <div className={styles.step_container}>
        <Fade cascade damping={0.1} className={styles.fade} triggerOnce>
          <CardSteps
            step_number={1}
            title={dict("title_one")}
            subtitle={dict("subtitle_one")}
            isActive={userStep >= 1}
            linkTo={`/${locale}/introduction`}
          />
          <CardSteps
            step_number={2}
            title={dict("title_two")}
            subtitle={dict("subtitle_two")}
            isActive={userStep >= 2}
            linkTo={`/${locale}/playground`}
          />
          <CardSteps
            step_number={3}
            title={dict("title_three")}
            subtitle={dict("subtitle_three")}
            isActive={userStep >= 3}
            linkTo={`/${locale}/my-business`}
          />
          <CardSteps
            step_number={4}
            title={dict("title_four")}
            subtitle={dict("subtitle_four")}
            isActive={userStep >= 4}
            linkTo={`/${locale}/gallery`}
          />
        </Fade>
      </div>
    </div>
  );
};

export default Step1;
