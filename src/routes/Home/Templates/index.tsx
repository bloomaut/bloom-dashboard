import styles from "./styles.module.scss";
import { useTranslations } from "next-intl";
import Image from "next/image";
import logo from "/public/assets/logo_uitrade.png";
// Components
import Title from "@/components/Title";
import Link from "next/link";

const Templates = () => {
  const dict = useTranslations("dict.home");
  return (
    <div className={styles.container}>
      <div className={styles.title_container}>
        <Title text={dict("templates")} />
        <div className={styles.trade_link}>
          <p>{dict("find_designs")}</p>
          <Link href={"https://uitrade.com"} target='_blank'>
            <Image src={logo} alt='uitrade' width={80} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Templates;
