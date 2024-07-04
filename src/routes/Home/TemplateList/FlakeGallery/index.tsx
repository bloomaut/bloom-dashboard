import styles from "./styles.module.scss";
import { useTranslations } from "next-intl";
import { Powerapp } from "@/typescript/interfaces/flakes.interface";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import Image from "next/image";
import Link from "next/link";

import Icon from "@/components/Icon";
import flake_icon_01 from "/public/flake_icon_01.svg";
import flake_icon_02 from "/public/flake_icon_02.svg";

interface Props {
  app: Powerapp;
  handleClick: (url: string, type: string) => void;
}

const FlakeGallery = ({ app, handleClick }: Props) => {
  const dict = useTranslations("dict.home");

  return (
    <div className={styles.template_container} key={app._id}>
      <h4 className={styles.title}>{app.skinx.title}</h4>
      <Link href={`https://uitool.com/skinx/${app._id}`} className={styles.link} target='_blank'>
        <p>{dict("link_uitool")}</p>
        <Icon name='link' strokeColor='#ff5722' viewBox='0 -13 50 50' />
      </Link>
      <div className={styles.template}>
        <div className={styles.sm_card} onClick={() => handleClick(app.hog_related.thumbnail, "hog")}>
          {app.hog_related.thumbnail ? (
            <Image
              src={app.hog_related.thumbnail}
              alt={app.skinx.title}
              width={167}
              height={120}
              style={{ borderRadius: "8px" }}
            />
          ) : (
            <Image className={styles.empty_img} src={flake_icon_01} alt='Icon' />
          )}
        </div>
        <div className={styles.lg_card} onClick={() => handleClick(app.thumbnail, "powerapp")}>
          {app.thumbnail ? (
            <Zoom classDialog='custom-zoom'>
              <Image
                src={app.thumbnail}
                alt={app.skinx.title}
                className={styles.image}
                width={800}
                height={800}
                priority
              />
            </Zoom>
          ) : (
            <Image className={styles.empty_img} src={flake_icon_02} alt='Icon' />
          )}
        </div>
      </div>
    </div>
  );
};

export default FlakeGallery;
