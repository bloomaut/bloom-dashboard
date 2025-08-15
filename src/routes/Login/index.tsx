"use client";
import Image from "next/image";
import Link from "next/link";
import styles from "./loginLanding.module.scss";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

const BUTTONS_DISABLED = false; // Set to true to disable all main CTA buttons

export default function SmallLanding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const dict = useTranslations("dict");
  const pathname = usePathname();
  const en = pathname.includes("/en");

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logoContainer} onClick={() => console.log(pathname, en)}>
            <Image src='/pointZeroIso.webp' alt='Small Logo' width={45} height={45} />
            <Image src='/pointZeroTipo.webp' alt='Small Logo' width={65} height={65} />
            <span className={styles.tagline}>{dict("landing.slogan")}</span>
          </div>
          <Link href='/api/auth/login'>
            <button className={styles.headerButton}>{dict("landing.cta")}</button>
          </Link>
        </div>
      </header>

      {/* Hero Section con VSL */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          {/* Contenido del Hero */}
          <div className={styles.heroText}>
            <div className={styles.heroTextContent}>
              <div className={styles.heroTextInner}>
                <div className={styles.heroHeadings}>
                  <h1 className={styles.heroTitle}>{dict("landing.title")}</h1>
                  <h2 className={styles.heroSubtitle}>{dict("landing.subtitle")}</h2>
                </div>
                <p className={styles.heroDescription}>{dict("landing.body")}</p>
              </div>

              <div className={styles.heroButtons}>
                <Link href='/api/auth/login'>
                  <button className={styles.heroMainButton}>{dict("landing.cta")}</button>
                </Link>
              </div>

              {/* Stats */}
              {/*  <div className={styles.stats}>
                <div className={styles.statItem}>
                  <div className={styles.statNumber}>500+</div>
                  <div className={styles.statLabel}>Pymes digitalizadas</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statNumber}>85%</div>
                  <div className={styles.statLabel}>Aumento en ventas</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statNumber}>Inmediata</div>
                  <div className={styles.statLabel}>Implementacion</div>
                </div>
              </div> */}
            </div>
          </div>

          {/* Video Player */}
          <div className={styles.carouselContainer}>
            <div className={styles.carouselWrapper}>
              <div className={styles.carousel} style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                {/* Slide 1: Image */}
                <div className={styles.carouselSlide}>
                  <div className={styles.imageContainer}>
                    <Image
                      src='/images/assets_hero.png' // Replace with your actual image path
                      alt='Small Platform Preview'
                      fill
                      className={styles.carouselImage}
                      priority
                      objectFit='contain'
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section
        style={{
          width: "100%",
          paddingBlock: "3rem",
          display: "flex",
          justifyContent: "center",
          backgroundColor: "rgba(58, 58, 58, 0.15)",
        }}
      >
        <div style={{ width: "75%", maxWidth: "900px", padding: "2rem 0" }}>
          <div className={styles.videoWrapper}>
            <iframe
              className={styles.videoIframe}
              src='https://player.vimeo.com/video/1100402596?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479'
              frameBorder='0'
              allow='autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share'
              title='VSL - Small'
            ></iframe>
          </div>
        </div>
      </section>
      {/* Roadmap Section */}
      <section className={styles.roadmapSection}>
        {/* Roadmap Figure */}
        <div className={styles.roadmapContainer}>
          <div className={styles.roadmapFigure}>
            <Image
              src={en ? "/onboarding_EN.webp" : "/images/roadmap_section_figure.png"}
              alt='Small Roadmap - Proceso de digitalización paso a paso'
              width={2878}
              height={2904}
              className={styles.roadmapImage}
              priority
              quality={100}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContainer}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>{dict("cta_section.title")}</h2>
            <p className={styles.ctaDescription}>{dict("cta_section.description")}</p>
            <div className={styles.ctaButtons}>
              <Link href='/api/auth/login'>
                <button className={styles.ctaButton}>{dict("cta_section.button")}</button>
              </Link>
            </div>
            <p className={styles.ctaDisclaimer}>{dict("cta_section.disclaimer")}</p>
          </div>
        </div>
      </section>

      {/* Platforms Section */}
      <section
        style={{
          width: "100%",
          paddingBlock: "2rem",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <div style={{ width: "100%", height: "100vh", position: "relative" }}>
          <Image
            src='/images/platformSection_EN.png'
            alt='Plataformas Small - Herramientas y soluciones digitales'
            fill
            priority
          />
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerGrid}>
            <div className={styles.footerLogoSection}>
              <div className={styles.logoContainer}>
                <Image src='/pointZeroIso.webp' alt='Small Logo' width={45} height={45} />
                <Image src='/pointZeroTipo.webp' alt='Small Logo' width={65} height={65} />
              </div>
              <p>From zero to 100. We transform ideas into businesses. Free, simple, and straightforward.</p>
            </div>

            <div className={styles.footerColumn}>
              <h4>{dict("footer.services_title")}</h4>
              <ul>
                <li>
                  <Link href='#'>{dict("footer.services_online_store")}</Link>
                </li>
                <li>
                  <Link href='#'>{dict("footer.services_digital_management")}</Link>
                </li>
                <li>
                  <Link href='#'>{dict("footer.services_digital_marketing")}</Link>
                </li>
                <li>
                  <Link href='#'>{dict("footer.services_technical_support")}</Link>
                </li>
              </ul>
            </div>

            <div className={styles.footerColumn}>
              <h4>{dict("footer.company_title")}</h4>
              <ul>
                <li>
                  <Link href='#'>{dict("footer.company_about_us")}</Link>
                </li>
                <li>
                  <Link href='#'>{dict("footer.company_success_stories")}</Link>
                </li>
                <li>
                  <Link href='#'>{dict("footer.company_blog")}</Link>
                </li>
                <li>
                  <Link href='#'>{dict("footer.company_contact")}</Link>
                </li>
              </ul>
            </div>

            <div className={styles.footerColumn}>
              <h4>{dict("footer.legal_title")}</h4>
              <ul>
                <li>
                  <Link href='#'>{dict("footer.legal_terms_of_use")}</Link>
                </li>
                <li>
                  <Link href='#'>{dict("footer.legal_privacy_policy")}</Link>
                </li>
                <li>
                  <Link href='#'>{dict("footer.legal_cookies")}</Link>
                </li>
              </ul>
            </div>
          </div>

          <div className={styles.footerBottom}>
            <p>{dict("footer.copyright")}</p>
          </div>
        </div>
      </footer>

      {/* Vimeo Player Script */}
      <script src='https://player.vimeo.com/api/player.js'></script>
    </div>
  );
}
