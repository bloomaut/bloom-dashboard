"use client";
import Image from "next/image";
import Link from "next/link";
import styles from "./loginLanding.module.scss";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { FaLinkedinIn, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { useState } from "react";

const BUTTONS_DISABLED = false; // Set to true to disable all main CTA buttons

export default function SmallLanding() {
  const dict = useTranslations("dict");
  const pathname = usePathname();
  const en = pathname.includes("/en");
  const [showVideo, setShowVideo] = useState(false);

  const handleVideoClick = () => {
    setShowVideo(true);
  };

  const getImageSrc = (baseName: string) => {
    return en ? `${baseName}.png` : `${baseName}_(ES).png`;
  };

  return (
    <div className={styles.container}>
      {/* Header flotante */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          {/* Logotipo */}
          <div className={styles.logo}>
            <Image src='/logotipo_horizontal.png' alt='Bloomit' width={203} height={73} priority />
          </div>

          {/* Botón CTA */}
          <Link href='/api/auth/login'>
            <button className={styles.headerButton}>{dict("header.cta")}</button>
          </Link>
        </div>
      </header>

      {/* 1. Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroIllustration}>
          <Image src='/illustrations/hero.png' alt='Hero illustration' width={635} height={636} priority />
        </div>
        <div className={styles.heroContentContainer}>
          <h1 className={styles.heroTitle}>
            {dict("hero.title.launch")} <span className={styles.primaryColor}>{dict("hero.title.fast")}</span>
            {dict("hero.title.and")} <span className={styles.secondaryColor}>{dict("hero.title.confidently")}</span>
          </h1>
          <h2 className={styles.heroSubtitle}>{dict("hero.subtitle1")}</h2>
          <h2 className={styles.heroSubtitle}>
            {dict("hero.subtitle2")} <span className={styles.secondaryColor}>{dict("hero.subtitle2_handle")}</span>{" "}
            {dict("hero.subtitle2_and")} <span className={styles.primaryColor}>{dict("hero.subtitle2_rest")}</span>
          </h2>
          <p className={styles.heroDescription}>
            <span className={styles.primaryBold}>{dict("hero.bloom_ai")}</span> {dict("hero.description")}{" "}
            <span className={styles.boldText}>{dict("hero.description_mentored")}</span>
            {dict("hero.description_middle")}{" "}
            <span className={styles.boldText}>{dict("hero.description_ecommerce")}</span> {dict("hero.description_end")}{" "}
            <span className={styles.secondaryBold}>{dict("hero.description_free")}</span>
          </p>
          <Link href='/api/auth/login'>
            <button className={styles.heroButton}>{dict("hero.cta")}</button>
          </Link>
        </div>
      </section>

      {/* 2. VSL Video Section */}
      <section className={styles.vslVideo}>
        {/* Ilustración izquierda */}
        <div className={styles.vslLeftIllustration}>
          <Image src='/illustrations/video_left.png' alt='Video left illustration' width={385} height={540} />
        </div>

        {/* Ilustración derecha */}
        <div className={styles.vslRightIllustration}>
          <Image src='/illustrations/video_right.png' alt='Video right illustration' width={421} height={540} />
        </div>

        {/* Video thumbnail centrado o iframe de Vimeo */}
        <div className={styles.vslVideoContainer}>
          {!showVideo ? (
            <Image
              src={getImageSrc("/video_thumnail")}
              alt='Video thumbnail'
              width={1056}
              height={594}
              className={styles.vslVideoThumbnail}
              onClick={handleVideoClick}
            />
          ) : (
            <iframe
              src={`${en ? "https://player.vimeo.com/video/1110327162" : "https://player.vimeo.com/video/1119261420"}?loop=1&autoplay=1&title=0&byline=0&portrait=0`}
              width='1056'
              height='594'
              frameBorder='0'
              allow='autoplay; fullscreen; picture-in-picture'
              allowFullScreen
              className={styles.vslVideoPlayer}
            ></iframe>
          )}
        </div>
      </section>

      {/* 3. Onboarding Roadmap Section */}
      <section className={styles.onboardingRoadmap}>
        <div className={styles.roadmapImageContainer}>
          <Image
            src={getImageSrc("/onboarding_roadmap")}
            alt='Onboarding Roadmap'
            width={1440}
            height={1641}
            className={styles.roadmapImage}
          />
        </div>
      </section>

      {/* 4. CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <div className={styles.ctaTextContainer}>
            <h3 className={styles.ctaTitle}>{dict("cta_section.title")}</h3>
            <h5 className={styles.ctaSubtitle}>{dict("cta_section.subtitle")}</h5>
          </div>

          <div className={styles.ctaButtonContainer}>
            <Link href='/api/auth/login'>
              <button className={styles.ctaButton}>{dict("cta_section.button")}</button>
            </Link>
            <p className={styles.ctaDisclaimer}>{dict("cta_section.disclaimer")}</p>
          </div>
        </div>
      </section>

      {/* 5. Bloomit Platforms Section */}
      <section className={styles.bloomitPlatforms}>
        <div className={styles.platformsContent}>
          <div className={styles.platformsContentText}>
            <h1 className={styles.platformsTitle}>
              <span className={styles.secondaryColor}>{dict("platforms.mobile")}</span>{" "}
              <span className={styles.primaryColor}>{dict("platforms.mentor")}</span>{" "}
              <span className={styles.secondaryColor}>{dict("platforms.app")}</span>
            </h1>

            <h4 className={styles.platformsSubtitle}>{dict("platforms.subtitle")}</h4>
          </div>
          <div className={styles.platformsImageContainer}>
            <Image
              src={getImageSrc("/platform_mobile")}
              alt='Bloomit Platforms Features'
              width={2520}
              height={1626}
              className={styles.platformsImage}
            />
          </div>
        </div>
      </section>

      {/* 5.2 Bloomit Peers Community */}
      <section className={styles.bloomitCommunity}>
        <div className={styles.communityContent}>
          <div className={styles.communityContentText}>
            <h1 className={styles.communityTitle}>
              <span className={styles.primaryColor}>{dict("community.peers")}</span>{" "}
              <span className={styles.secondaryColor}>{dict("community.network")}</span>
            </h1>

            <h4 className={styles.communitySubtitle}>{dict("community.subtitle")}</h4>
          </div>
          <div className={styles.communityImageContainer}>
            <Image
              src={getImageSrc("/peers_network")}
              alt='Bloomit Peers Network'
              width={1536}
              height={1024}
              className={styles.communityImage}
            />
          </div>
        </div>
      </section>

      {/* 6. Desktools Section */}
      <section className={styles.desktoolsSection}>
        <div className={styles.desktoolsContent}>
          <h1 className={styles.desktoolsTitle}>
            {dict("desktools.title")} <span className={styles.secondaryColor}>{dict("desktools.ecommerce")}</span>
          </h1>

          <div className={styles.desktoolsImageContainer}>
            <Image
              src={getImageSrc("/desktools")}
              alt='Desktools Features'
              width={2762}
              height={2128}
              className={styles.desktoolsImage}
            />
          </div>
        </div>
      </section>

      {/* 7. All-in-One Business Platform Section */}
      <section className={styles.allInOneSection}>
        <div className={styles.allInOneContent}>
          <h1 className={styles.allInOneTitle}>
            <span className={styles.primaryColor}>{dict("all_in_one.title")}</span>{" "}
            <span className={styles.secondaryColor}>{dict("all_in_one.rest")}</span>
          </h1>

          <div className={styles.allInOneImageContainer}>
            <Image
              src={getImageSrc("/platforms")}
              alt='All-in-One Business Platform'
              width={2465}
              height={1479}
              className={styles.allInOneImage}
            />
          </div>
        </div>
      </section>

      {/* 8. Footer Section */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          {/* Logo y redes sociales */}
          <div className={styles.footerBrand}>
            <Image
              src='/logotipo_horizontal.png'
              alt='Bloomit Logo'
              width={203}
              height={73}
              className={styles.footerLogo}
            />
            <div className={styles.socialSection}>
              <p className={styles.followText}>{dict("footer.follow")}</p>
              <div className={styles.socialIcons}>
                <a href='#' className={styles.socialIcon}>
                  <FaLinkedinIn />
                </a>
                <a href='#' className={styles.socialIcon}>
                  <FaXTwitter />
                </a>
                <a href='#' className={styles.socialIcon}>
                  <FaInstagram />
                </a>
                <a href='#' className={styles.socialIcon}>
                  <FaTiktok />
                </a>
                <a href='#' className={styles.socialIcon}>
                  <FaYoutube />
                </a>
              </div>
            </div>
          </div>

          {/* Columnas de enlaces */}
          <div className={styles.footerColumns}>
            <div className={styles.footerColumn}>
              <h4 className={styles.columnTitle}>{dict("footer.services.title")}</h4>
              <ul className={styles.columnLinks}>
                <li>
                  <Link href='#'>{dict("footer.services.online_store")}</Link>
                </li>
                <li>
                  <Link href='#'>{dict("footer.services.digital_management")}</Link>
                </li>
                <li>
                  <Link href='#'>{dict("footer.services.digital_marketing")}</Link>
                </li>
              </ul>
            </div>

            <div className={styles.footerColumn}>
              <h4 className={styles.columnTitle}>{dict("footer.company.title")}</h4>
              <ul className={styles.columnLinks}>
                <li>
                  <Link href='#'>{dict("footer.company.about")}</Link>
                </li>
                <li>
                  <Link href='#'>{dict("footer.company.blog")}</Link>
                </li>
                <li>
                  <Link href='#'>{dict("footer.company.contact")}</Link>
                </li>
              </ul>
            </div>

            <div className={styles.footerColumn}>
              <h4 className={styles.columnTitle}>{dict("footer.legal.title")}</h4>
              <ul className={styles.columnLinks}>
                <li>
                  <Link href='#'>{dict("footer.legal.terms")}</Link>
                </li>
                <li>
                  <Link href='#'>{dict("footer.legal.privacy")}</Link>
                </li>
                <li>
                  <Link href='#'>{dict("footer.legal.cookies")}</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className={styles.footerDivider}></div>

        {/* Copyright */}
        <div className={styles.footerBottom}>
          <p className={styles.copyright}>{dict("footer.copyright")}</p>
        </div>
      </footer>
    </div>
  );
}
