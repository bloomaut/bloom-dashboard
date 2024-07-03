import styles from "./styles.module.scss";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
// Components
import Title from "@/components/Title";
import LinkCard from "./LinkCard";
import IntroVideo from "./IntroVideo";
import PopupVideo from "@/components/PopupVideo";

const Banner = () => {
  const [openPopup, setOpenPopup] = useState(false);
  const locale = useLocale();
  const dict = useTranslations("dict");

  return (
    <div className={styles.container}>
      <Title text={dict("home.welcome")} />
      <div className={styles.link_container}>
        <div onClick={() => setOpenPopup(true)}>
          <LinkCard text={dict("home.introduction.title")} description={dict("home.introduction.description")} />
        </div>

        <LinkCard
          text={dict("home.business.title")}
          description={dict("home.business.description")}
          link={`${locale}/my-business`}
        />
        <LinkCard
          text={dict("home.hotlink.title")}
          description={dict("home.hotlink.description")}
          link={`${locale}/hotlink`}
        />
        {openPopup && (
          <PopupVideo
            title={dict("popup.introduction")}
            video={<IntroVideo height='280px' />}
            onClose={() => setOpenPopup(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Banner;
