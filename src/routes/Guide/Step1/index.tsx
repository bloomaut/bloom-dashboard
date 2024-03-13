import styles from "./styles.module.scss";
import { useTranslations, useLocale } from "next-intl";
import Steps from "../Steps";
import { useState, useEffect } from "react";
import { get } from "@/services/fetch";

const Step1 = () => {
  const dict = useTranslations("dict.guide.stepper_one");
  const locale = useLocale();

  const [activeStep, setActiveStep] = useState(null);

  useEffect(() => {
    const fetchUserStep = async () => {
      try {
        const userData = await get("small-business/me", "NEXT_PUBLIC_API_DASH");
        //console.log("User Data ok:", userData);
        const userStep = userData.result.data.smallBusiness.step;
        console.log("User step:", userStep);
        setActiveStep(userStep);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserStep();
  }, []);

  return (
    <div className={styles.container}>
      <h1>{dict("title")}</h1>
      <div className={styles.step_container}>
        <Steps
          step_number={1}
          title={dict("title_one")}
          subtitle={dict("subtitle_one")}
          isActive={activeStep === 1}
          linkTo={`/${locale}/introduction`}
        />
        <Steps
          step_number={2}
          title={dict("title_two")}
          subtitle={dict("subtitle_two")}
          isActive={activeStep === 2}
          linkTo={`/${locale}/playground`}
        />
        <Steps
          step_number={3}
          title={dict("title_three")}
          subtitle={dict("subtitle_three")}
          isActive={activeStep === 3}
          linkTo={`/${locale}/my-business`}
        />
        <Steps
          step_number={4}
          title={dict("title_four")}
          subtitle={dict("subtitle_four")}
          isActive={activeStep === 4}
          linkTo={`/${locale}/design`}
        />
      </div>
    </div>
  );
};

export default Step1;
