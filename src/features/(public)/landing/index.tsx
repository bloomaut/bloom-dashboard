"use client";
import Image from "next/image";
import Link from "next/link";
import styles from "./styles/landing.module.scss";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { FaLinkedinIn, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { useEffect, useState } from "react";

export default function Landing() {
  const dict = useTranslations("dict");
  const pathname = usePathname();
  const en = pathname.includes("/en");
  const [showVideo, setShowVideo] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const disableLogin = process.env.NEXT_PUBLIC_DISABLE_LOGIN === "true";
  const apiDash = process.env.NEXT_PUBLIC_API_DASH;
  const apiDashBase =
    apiDash
      ?.trim()
      .replace(/\/+$/, "")
      .replace(/\/api$/, "") || "";
  const loginHref = apiDashBase ? `${apiDashBase}/api/auth/google` : `/api/auth/google`;

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const media = window.matchMedia("(max-width: 768px)");
    const onChange = () => setIsMobile(media.matches);
    onChange();
    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    }
    media.addListener(onChange);
    return () => media.removeListener(onChange);
  }, []);

  const handleVideoClick = () => {
    setShowVideo(true);
  };

  const getImageSrc = (baseName: string) => {
    return en ? `${baseName}.png` : `${baseName}_(ES).png`;
  };

  const tallyButtonProps = disableLogin
    ? {
        type: "button" as const,
        "data-tally-open": "81pjjl",
        "data-tally-layout": "modal",
        "data-tally-width": "500",
        "data-tally-emoji-text": "👋",
        "data-tally-emoji-animation": "wave",
      }
    : null;

  return (
    <div className={styles.container}>
      {/* Header flotante */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          {/* Logotipo */}
          <div className={styles.logo}>
            <Image src='/logotipo_horizontal.png' alt='Bloomaut' width={331} height={74} priority />
          </div>

          {/* Navigation Links Header*/}
          <div className={styles.headerLeft}>
            <Link href={en ? "/en/pricing" : "/es/pricing"}>
              <button className={styles.headerButton}>{dict("header.pricing")}</button>
            </Link>
          </div>
        </div>
      </header>

      {/* 1. Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroIllustration}>
          <Image src='/illustrations/hero.png' alt='Hero illustration' width={937} height={937} priority />
        </div>
        <div className={styles.heroContentContainer}>
          <h1 className={styles.heroTitle}>
            {dict("hero.title.part1")} <span className={styles.primaryColor}>{dict("hero.title.part2")}</span>
            {dict("hero.title.part3")}
          </h1>
          <h1 className={styles.heroTitle}>
            <span className={styles.secondaryColor}>{dict("hero.title.part4")}</span>
            {dict("hero.title.part5")} <span className={styles.primaryColor}>{dict("hero.title.part6")}</span>
          </h1>
          <h2 className={styles.heroSubtitle}>
            {dict("hero.subtitle.part1")}
            <span className={styles.boldTextBlack}>{dict("hero.subtitle.part2")}</span>
            {dict("hero.subtitle.part3")}
            <span className={styles.secondaryColor}>{dict("hero.subtitle.part4")}</span>
            {dict("hero.subtitle.part5")}
          </h2>
          <h2 className={styles.heroSubtitle}>
            {dict("hero.subtitle.part6")}
            <span className={styles.primaryColor}>{dict("hero.subtitle.part7")}</span>
            {dict("hero.subtitle.part8")}
          </h2>
          <p className={styles.heroDescription}>
            <span className={styles.primaryBold}>{dict("hero.body.part1")}</span> {dict("hero.body.part2")}
            <span className={styles.secondaryBold}>{dict("hero.body.part3")}</span>
            {dict("hero.body.part4")}
            <span className={styles.boldText}>{dict("hero.body.part5")}</span>
          </p>
          {disableLogin ? (
            <button className={styles.heroButton} {...tallyButtonProps}>
              {dict("hero.button.cta")}
            </button>
          ) : (
            <Link href={loginHref}>
              <button className={styles.heroButton}>{dict("hero.button.cta")}</button>
            </Link>
          )}
        </div>
      </section>

      {/* Divisor de seccion*/}
      <div className={styles.divider} />

      {/* 2. Community Section */}
      <section className={styles.onboardingRoadmap}>
        <div className={styles.roadmapImageContainer}>
          {isMobile ? (
            <Image
              src='/community_(mobile)_(ES).png'
              alt='Community'
              width={440}
              height={478}
              className={styles.roadmapImage}
            />
          ) : (
            <Image
              src={getImageSrc("/community")}
              alt='Community'
              width={1728}
              height={1117}
              className={styles.roadmapImage}
            />
          )}
        </div>
      </section>

      {/* 3. CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <div className={styles.ctaTextContainer}>
            <h3 className={styles.ctaTitle}>{dict("cta_section.title")}</h3>
            <h5 className={styles.ctaSubtitle}>{dict("cta_section.subtitle")}</h5>
          </div>

          <div className={styles.ctaButtonContainer}>
            {disableLogin ? (
              <button className={styles.ctaButton} {...tallyButtonProps}>
                {dict("cta_section.button")}
              </button>
            ) : (
              <Link href={loginHref}>
                <button className={styles.ctaButton}>{dict("cta_section.button")}</button>
              </Link>
            )}
            <p className={styles.ctaDisclaimer}>{dict("cta_section.disclaimer")}</p>
          </div>
        </div>
      </section>

      {/* 4. Onboarding Roadmap Section */}
      <section className={styles.onboardingRoadmap}>
        <div className={styles.roadmapImageContainer}>
          {isMobile ? (
            <Image
              src='/bloomaut_working_(mobile)_(ES).png'
              alt='Bloomaut Working Process'
              width={440}
              height={2070}
              className={styles.roadmapImage}
            />
          ) : (
            <Image
              src={getImageSrc("/bloomaut_working")}
              alt='Bloomaut Working Process'
              width={1728}
              height={4474}
              className={styles.roadmapImage}
            />
          )}
        </div>
      </section>

      {/* Divisor de seccion*/}
      <div className={styles.dividerGradient} />

      {/* 5. Footer Section */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerTop}>
            <Image
              src='/logotipo_horizontal.png'
              alt='Bloomaut Logo'
              width={331}
              height={74}
              className={styles.footerLogo}
            />
            <div className={styles.socialIcons}>
              <a href='#' className={styles.socialIcon} aria-label='LinkedIn'>
                <FaLinkedinIn />
              </a>
              <a href='#' className={styles.socialIcon} aria-label='X'>
                <FaXTwitter />
              </a>
              <a href='#' className={styles.socialIcon} aria-label='Instagram'>
                <FaInstagram />
              </a>
              <a href='#' className={styles.socialIcon} aria-label='TikTok'>
                <FaTiktok />
              </a>
              <a href='#' className={styles.socialIcon} aria-label='YouTube'>
                <FaYoutube />
              </a>
            </div>
          </div>

          <nav className={styles.footerNav} aria-label='Footer'>
            <div className={styles.footerColumn}>
              <h4 className={styles.columnTitle}>{dict("footer.company.title")}</h4>
              <ul className={styles.columnLinks}>
                <li>
                  <Link href={en ? "/en/about" : "/es/about"}>{dict("footer.company.about")}</Link>
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
                  <Link href={en ? "/en/policy" : "/es/policy"}>{dict("footer.legal.terms")}</Link>
                </li>
                <li>
                  <Link href={en ? "/en/policy" : "/es/policy"}>{dict("footer.legal.privacy")}</Link>
                </li>
                <li>
                  <Link href={en ? "/en/policy" : "/es/policy"}>{dict("footer.legal.cookies")}</Link>
                </li>
              </ul>
            </div>
          </nav>

          <div className={styles.footerCta}>
            {disableLogin ? (
              <button className={styles.footerCtaButton} {...tallyButtonProps}>
                PROBAR BLOOMAUT
              </button>
            ) : (
              <Link href={loginHref}>
                <button className={styles.footerCtaButton}>PROBAR BLOOMAUT</button>
              </Link>
            )}
          </div>

          <div className={styles.footerDivider} />

          <div className={styles.footerBottom}>
            <p className={styles.copyright}>{dict("footer.copyright")}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
