"use client";
import { useTranslations } from "next-intl";
import ItemTrack from "./ItemTrack";
import styles from "./styles.module.scss";
import { useAppSelector } from "@/store/hooks";
import { useEffect, useState } from "react";

const SideTrack = () => {
  const userData = useAppSelector(state => state.userData);
  const dict = useTranslations("dict.sidetrack");
  const [activeSideTrack, setActiveSideTrack] = useState<boolean>(false);

  const handleValidationStep01 = () => {
    if (
      userData.name &&
      userData.lastname &&
      userData.client.name &&
      userData.client.category &&
      userData.client.description &&
      userData.client.logo
    ) {
      return true;
    } else {
      return false;
    }
  };

  const handleValidationStep02 = () => {
    if (step_01) {
      if (userData.client.onboardings?.skinx_template && userData.client.onboardings?.skinx_template !== null) {
        return true;
      }
    }
    return false;
  };

  const handleValidationStep03 = () => {
    if (step_01 && step_02) {
      // Falta lógica acá
      return false;
    } else {
      return false;
    }
  };

  const handleValidationStep04 = () => {
    if (step_01 && step_02 && step_03) {
      if (userData.client.onboardings?.skinx_generated && userData.client.onboardings?.skinx_generated !== null) {
        return true;
      }
    } else {
      return false;
    }
  };

  const step_01 = handleValidationStep01() || false;
  const step_02 = handleValidationStep02() || false;
  const step_03 = handleValidationStep03() || false;
  const step_04 = handleValidationStep04() || false;

  // Cuando el componente se monta, se chequea si completó el onboarding
  useEffect(() => {
    if (userData.id) {
      if (!step_04) {
        setActiveSideTrack(true);
      } else {
        setActiveSideTrack(false);
      }
      console.log(step_01, step_02, step_03, step_04);
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
  const subtitle = data.find(i => i.isActive === true);

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
