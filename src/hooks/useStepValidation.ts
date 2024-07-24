import { useMemo } from "react";
import { useAppSelector } from "@/store/hooks";

const useStepValidation = () => {
  const userData = useAppSelector(state => state.userData);

  const step_01 = useMemo(() => {
    return Boolean(
      userData.name &&
        userData.lastname &&
        userData.client.name &&
        userData.client.category &&
        userData.client.description &&
        userData.client.logo,
    );
  }, [userData]);

  const step_02 = useMemo(() => {
    return Boolean(step_01 && userData.client.onboardings !== null);
  }, [step_01, userData]);

  const step_03 = useMemo(() => {
    return Boolean(step_01 && step_02 && userData.isCatalogComplete);
  }, [step_01, step_02, userData]);

  const step_04 = useMemo(() => {
    if (userData.client.onboardings)
      return Boolean(
        step_01 &&
          step_02 &&
          userData.client.onboardings[0].skinx_generated &&
          userData.client.onboardings[0].skinx_generated !== null,
      );
  }, [step_01, step_02, step_03, userData]);

  const currentStep = useMemo(() => {
    if (!step_01) return 0;
    if (!step_02) return 1;
    if (!step_03) return 2;
    if (!step_04) return 3;
    return 4;
  }, [step_01, step_02, step_03, step_04]);

  return {
    step_01,
    step_02,
    step_03,
    step_04,
    currentStep,
  };
};

export default useStepValidation;
