import "@/styles/globals.scss";
import styles from "./layout.module.scss";
import OnboardingWrapper from "@/features/(onboarding)";
import OnboardingGuard from "@/features/(onboarding)/guards/OnboardingGuard";

const OnboardingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={styles.container}>
      <OnboardingGuard>
        <OnboardingWrapper>{children}</OnboardingWrapper>
      </OnboardingGuard>
    </div>
  );
};

export default OnboardingLayout;
