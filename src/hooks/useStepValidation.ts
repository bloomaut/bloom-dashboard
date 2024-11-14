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
    return false; // TODO: Falta lógica de validación del step
  }, [step_01, userData]);

  const currentStep = useMemo(() => {
    if (!step_01) return 1;
    if (!step_02) return 2;
    return 5;
  }, [step_01, step_02]);

  return {
    step_01,
    step_02,
    currentStep,
  };
};

export default useStepValidation;
