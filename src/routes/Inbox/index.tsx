import styles from "./styles.module.scss";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useTranslations } from "next-intl";
//Componentes
import Title from "@/components/Title";
import QrModal from "./Qr";
//Imagenes
import miniQr from "@/../public/assets/miniQr.png";
import play from "@/../public/assets/play.png";

const InboxPage = () => {
  const [showPopup, setShowPopup] = useState(false);
  const dict = useTranslations("dict.inbox");

  return (
    <section className={styles.container}>
      <div className={styles.title_container}>
        <Title text={dict("title")} />
        <div className={styles.inner_container}>
          <h5>{dict("subtitle")}</h5>
          <div className={styles.box}>
            <Link href='https://play.google.com/store/apps/details?id=com.notimation.agentcaller' target='_blank'>
              <Image src={play} alt='Google Play Logo' width={25} height={25} />
            </Link>
            <button onClick={() => setShowPopup(!showPopup)}>
              <Image src={miniQr} alt='QR' width={25} height={25} />
            </button>

            {showPopup && <QrModal setShowPopup={() => setShowPopup(!showPopup)} />}
          </div>
        </div>
      </div>

      <iframe src='https://notimation.com/es/agents' title='Agents App' width='950' height='550'></iframe>
    </section>
  );
};

export default InboxPage;
