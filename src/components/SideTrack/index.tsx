import { useTranslations } from "next-intl";
import ItemTrack from "./ItemTrack";
import styles from "./styles.module.scss";
import { useAppSelector } from "@/store/hooks";
import { Dispatch, SetStateAction, useEffect } from "react";

interface SideTrackProps {
  setActiveSideTrack: Dispatch<SetStateAction<boolean>>;
}

const SideTrack = ({ setActiveSideTrack }: SideTrackProps) => {
  const userData = useAppSelector(state => state.userData);
  const dict = useTranslations("dict.sidetrack");

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

  const handleValidationStep02 = (step_01: boolean) => {
    if (step_01) {
      if (userData.client.onboardings?.skinx_template && userData.client.onboardings?.skinx_template !== null) {
        return true;
      }
    }
    return false;
  };

  const handleValidationStep04 = () => {
    if (userData.client.onboardings?.skinx_generated && userData.client.onboardings?.skinx_generated !== null) {
      return true;
    } else {
      return false;
    }
  };

  const step_01 = handleValidationStep01();
  const step_02 = handleValidationStep02(step_01);
  const step_04 = handleValidationStep04();

  useEffect(() => {
    if (step_04) {
      setActiveSideTrack(false);
    } else {
      setActiveSideTrack(true);
    }
  }, [step_04]);

  const data = [
    {
      position: 1,
      title: `${dict("step_1")}`,
      route: `/my-business`,
      iconName: "business_info",
      iconW: 22,
      iconH: 22,
      isActive: !step_01,
    },
    {
      position: 2,
      title: `${dict("step_2")}`,
      route: `/templates`,
      iconName: "select_template",
      iconW: 20,
      iconH: 19,
      isActive: step_02 === false ? true : false,
    },
    {
      position: 3,
      title: `${dict("step_3")}`,
      route: `/catalog`,
      isActive: false,
      iconName: "select_catalog",
      iconW: 20,
      iconH: 20,
    },
    {
      position: 4,
      title: `${dict("step_4")}`,
      route: `/hotlink`,
      isActive: step_01 === false && step_02 === false && step_04 === true ? false : true,
      iconName: "generate_powerapp",
      iconW: 22,
      iconH: 12,
    },
  ];
  const subtitle = data.find(i => i.isActive === true);

  return (
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
  );
};

export default SideTrack;
