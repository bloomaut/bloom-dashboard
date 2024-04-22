import styles from "./styles.module.scss";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useTranslations } from "next-intl";
//Componentes
import Title from "@/components/Title";
import QrModal from "./Qr";
//Imagenes
import miniQr from "@/../public/assets/inbox_mini_qr.png";
import play from "@/../public/assets/inbox_play_icon.png";

const InboxPage = () => {
  const [showPopup, setShowPopup] = useState(false);
  const dict = useTranslations("dict.inbox");

  return (
    <section className={styles.container}>
      <iframe src='https://notimation.com/es/agents' title='Agents App' width='100%' height='100%'></iframe>
    </section>
  );
};

export default InboxPage;
