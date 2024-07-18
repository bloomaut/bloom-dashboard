"use client";
import { useTranslations } from "next-intl";
import ItemTrack from "./ItemTrack";
import styles from "./styles.module.scss";
import { useAppSelector } from "@/store/hooks";
import { useEffect, useState } from "react";
import useStepValidation from "@/hooks/useStepValidation";
import { usePathname } from "next/navigation";

const SideTrack = () => {
  const userData = useAppSelector(state => state.userData);
  const dict = useTranslations("dict.sidetrack");
  const [activeSideTrack, setActiveSideTrack] = useState<boolean>(false);
  const { step_01, step_02, step_03, step_04, currentStep } = useStepValidation();
  const path = usePathname();

  // Cuando el componente se monta, se chequea si completó el onboarding
  useEffect(() => {
    if (userData.id) {
      if (!step_04) {
        setActiveSideTrack(true);
      } else {
        setActiveSideTrack(false);
      }
    }
  }, [step_04, userData]);

  // Data to render
  const data = [
    {
      position: 1,
      title: `${dict("step_1")}`,
      route: `/my-business`,
      iconName: "business_info",
      iconW: 22,
      iconH: 22,
      isActive: true,
    },
    {
      position: 2,
      title: `${dict("step_2")}`,
      route: `/templates`,
      iconName: "select_template",
      iconW: 20,
      iconH: 19,
      isActive: step_01,
    },
    {
      position: 3,
      title: `${dict("step_3")}`,
      route: `/catalog`,
      isActive: step_02,
      iconName: "select_catalog",
      iconW: 20,
      iconH: 20,
    },
    {
      position: 4,
      title: `${dict("step_4")}`,
      route: `/hotlink`,
      isActive: step_03,
      iconName: "generate_powerapp",
      iconW: 22,
      iconH: 12,
    },
  ];
  const subtitle = data.find(i => path.includes(i.route)) || data[currentStep];

  return (
    <>
      {activeSideTrack && (
        <section className={styles.sidetrack_container}>
          <div className={styles.title_container}>
            <h2 className={styles.title}>
              {dict("title")} {subtitle?.position || ""}
            </h2>
            <p className={styles.description}>{subtitle?.title || ""}</p>
          </div>
          <div className={styles.steps_container}>
            {data.map(btn => {
              return (
                <ItemTrack
                  key={btn.title}
                  title={btn.title}
                  route={btn.route}
                  iconH={btn.iconH}
                  iconW={btn.iconW}
                  iconName={btn.iconName}
                  isActive={btn.isActive}
                />
              );
            })}
          </div>
        </section>
      )}
    </>
  );
};

export default SideTrack;
