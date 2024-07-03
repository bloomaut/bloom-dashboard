import styles from "./styles.module.scss";
import Link from "next/link";
import Image from "next/image";
import logo from "/public/assets/logo_uitrade.png";
import { useTranslations } from "next-intl";
import { useFlakeData } from "@/hooks/useFlakesUser";
import { Powerapp } from "@/typescript/interfaces/flakes.interface";
import { useState } from "react";
import { useMessageToast } from "@/hooks/useMessageToast";
// Components
import Title from "@/components/Title";
import FlakeGallery from "@/components/FlakeGallery";
import LoadingSpinner from "@/components/Loading";

const Templates = () => {
  const { flakes } = useFlakeData();
  const dict = useTranslations("dict.home");
  const [selectedImage, setSelectedImage] = useState<{ url: string; type: string } | null>(null);
  const { notifyError } = useMessageToast();

  const handleClick = (url: string, type: string) => {
    if (url && type === "hog")
      setSelectedImage(prevState => {
        if (prevState?.url === url && prevState.type === type) {
          return prevState;
        }
        return { url, type };
      });
    else if (url === null) {
      notifyError(dict("error"));
    }
  };

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
      <div className={styles.flakes_container}>
        {flakes.length ? (
          flakes?.slice(0, 6).map((app: Powerapp) => <FlakeGallery app={app} handleClick={handleClick} />)
        ) : (
          <div className={styles.loading}>
            <LoadingSpinner />
          </div>
        )}
      </div>
    </div>
  );
};

export default Templates;
