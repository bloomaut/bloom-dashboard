import styles from "./styles.module.scss";
import Image from "next/image";
import Icon from "@/components/Icon";
import { useState } from "react";
import { HogRelated } from "@/typescript/interfaces/flakes.interface";
import { useTranslations } from "next-intl";

const TemplateCard = ({ _id, title, thumbnail }: HogRelated) => {
  const [openPopup, setOpenPopup] = useState(false);
  const dict = useTranslations("dict.designs.diffusion");

  const handleClick = () => {
    setOpenPopup(!openPopup);
  };

  return (
    <div className={styles.hog}>
      <div className={styles.head}>
        <p className={styles.title}>{title}</p>
        <p className={styles.option} onClick={handleClick}>
          <Icon name='ellipsis' width={20} height={20} viewBox='0 3 30 30' />
          {openPopup && (
            <p className={styles.create}>
              <button onClick={() => alert("holi")}>
                <Icon name='add' viewBox='0 0 25 20' strokeColor='#7f7f7f' />
                {dict("create_design")}
              </button>
            </p>
          )}
        </p>
      </div>
      <div className={styles.imageWrapper}>
        <Image src={thumbnail || ""} alt='Hog' layout='fill' />
      </div>
    </div>
  );
};

export default TemplateCard;
