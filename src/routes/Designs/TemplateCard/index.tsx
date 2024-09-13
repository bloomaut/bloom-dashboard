import styles from "./styles.module.scss";
import Image from "next/image";
import Icon from "@/components/Icon";
import default_image from "/public/assets/default_image.png";
import { useState } from "react";
import { HogRelated } from "@/typescript/interfaces/flakes.interface";
import { useTranslations } from "next-intl";
import { Link } from "@/navigation";

const TemplateCard = ({ title, thumbnail, _id, type }: HogRelated) => {
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
            <div className={styles.popup}>
              {type === "" ? (
                <>
                  <p className={styles.create}>
                    <Link href={`/designs/create/${_id}`}>
                      <Icon name='eye' viewBox='0 0 25 20' strokeColor='#7f7f7f' />
                      {dict("view_design")}
                    </Link>
                  </p>
                  <p className={styles.create}>
                    <Link href={`/designs/create/${_id}`}>
                      <Icon name='design_2' viewBox='0 0 25 20' strokeColor='#7f7f7f' />
                      {dict("edit_design")}
                    </Link>
                  </p>
                  <p className={styles.create}>
                    <Link href={`/designs/create/${_id}`}>
                      <Icon name='delete' viewBox='0 0 25 20' strokeColor='#7f7f7f' />
                      {dict("delete_design")}
                    </Link>
                  </p>
                </>
              ) : (
                <p className={styles.create}>
                  <Link href={`/designs/create/${_id}`}>
                    <Icon name='design_2' viewBox='0 0 25 20' strokeColor='#7f7f7f' />
                    {dict("create_design")}
                  </Link>
                </p>
              )}
            </div>
          )}
        </p>
      </div>
      <div className={styles.imageWrapper}>
        <Image src={thumbnail || default_image} fill sizes='500px' priority alt='Hog' />
      </div>
    </div>
  );
};

export default TemplateCard;
