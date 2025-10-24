import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import styles from "./styles.module.scss";

const WishList: React.FC = () => {
  const dict = useTranslations("dict.wishlist");

  return (
    <div className={styles.wishlistPage}>
      {/* Ilustración izquierda - Resolución nativa: 416 × 2200 */}
      <div className={styles.illustrationLeft}>
        <Image
          src='/illustrations/wishlist_left.png'
          alt='Decoración izquierda'
          width={416}
          height={2200}
          className={styles.illustrationImage}
          priority
        />
      </div>

      {/* Ilustración derecha - Resolución nativa: 676 × 2200 */}
      <div className={styles.illustrationRight}>
        <Image
          src='/illustrations/wishlist_right.png'
          alt='Decoración derecha'
          width={676}
          height={2200}
          className={styles.illustrationImage}
          priority
        />
      </div>

      {/* Contenido principal - Tamaños reducidos a la mitad */}
      <div className={styles.mainContent}>
        <div className={styles.contentInner}>
          {/* Logo Bloom - Tamaño reducido a la mitad */}
          <div className={styles.logo}>
            <Image
              src='/bloomLogo.png'
              alt='Bloom Logo'
              width={19894}
              height={6276}
              className={styles.logoImage}
              priority
            />
          </div>

          {/* Título - Tamaños reducidos a la mitad */}
          <h2 className={styles.title}>{dict("title")}</h2>

          {/* Descripción - Tamaños reducidos a la mitad */}
          <div className={styles.description}>
            <span className={styles.highlight}>{dict("joined_message")} </span>
            {dict("notification_message")}
          </div>

          {/* Ilustración de flores - Tamaño reducido a la mitad */}
          <div className={styles.flowers}>
            <Image
              src='/illustrations/wishlist_flowers.png'
              alt='Flores decorativas'
              width={3072}
              height={2048}
              className={styles.flowersImage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishList;
