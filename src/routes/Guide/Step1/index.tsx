import styles from "./styles.module.scss";
import { useTranslations, useLocale } from "next-intl";
import Steps from "../Steps";
import { useState, useEffect } from "react";
import { get, update } from "@/services/fetch";

const Step1 = () => {
  const dict = useTranslations("dict.guide.stepper_one");
  const locale = useLocale();

  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    const fetchUserStep = async () => {
      try {
        const userData = await get("small-business/me", "NEXT_PUBLIC_API_DASH");
        // UserData ok 200
        console.log("UserData:", userData);
        const userStep = userData.result.data.smallBusiness.step;
        //UserStep ok por defecto 1
        //console.log("UserStep:", userStep);
        const userId = userData.result.data.smallBusiness.client_id || "";
        //User ok
        // console.log("User", userId);
        setActiveStep(userStep);
        setUserId(userId);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserStep();
  }, []);
  {
    /*

  const handleStepClick = async (stepNumber: number) => {
    setActiveStep(stepNumber);
    console.log("New step:", stepNumber);
    try {
      await update("small-business/me", userId, "NEXT_PUBLIC_API_DASH", { step: stepNumber } || undefined);
      console.log("User step updated successfully");
    } catch (error) {
      console.error("Error updating user step:", error);
    }
  };
   */
  }

  return (
    <div className={styles.container}>
      <h1>{dict("title")}</h1>
      <div className={styles.step_container}>
        {/*<div onClick={() => handleStepClick(1)}> */}
        <Steps
          step_number={1}
          title={dict("title_one")}
          subtitle={dict("subtitle_one")}
          isActive={activeStep === 1}
          linkTo={`/${locale}/introduction`}
        />
        {/*  </div>
        <div onClick={() => handleStepClick(2)}>*/}
        <Steps
          step_number={2}
          title={dict("title_two")}
          subtitle={dict("subtitle_two")}
          isActive={activeStep === 2}
          linkTo={`/${locale}/playground`}
        />
        {/*  </div> */}

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
