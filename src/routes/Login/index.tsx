import Image from "next/image";
import Link from "next/link";
import styles from "./loginLanding.module.scss";
import { useState } from "react";

const BUTTONS_DISABLED = false; // Set to true to disable all main CTA buttons

export default function SmallLanding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logoContainer}>
            <Image src='/images/small-logo.png' alt='Small Logo' width={191} height={45} className={styles.logo} />
            <span className={styles.tagline}>de cero a todo</span>
          </div>
          <Link href='/api/auth/login'>
            <button className={styles.headerButton} disabled={BUTTONS_DISABLED}>
              Crea tu negocio
            </button>
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
                <div className={styles.badge}>
                  <span className={styles.badgeDot}></span>
                  Transformación Digital Simplificada
                </div>
                <div className={styles.heroHeadings}>
                  <h1 className={styles.heroTitle}>
                    Lanzá tu negocio con <span className={styles.heroTitleAccent}>IA</span>.
                  </h1>
                  <h2 className={styles.heroSubtitle}>Todo gratis, simple y sin vueltas.</h2>
                </div>
                <p className={styles.heroDescription}>
                  Armamos tu marca, tienda y estrategia con IA. Solo respondés unas preguntas y te damos todo listo para
                  arrancar. <span className={styles.heroDescriptionBold}>Si cumplís</span> las metas de venta y
                  viralización, <span className={styles.heroDescriptionBold}>no pagás nada</span>. Con Small, te la
                  jugás y nosotros también.
                </p>
              </div>

              <div className={styles.heroButtons}>
                <Link href='/api/auth/login'>
                  <button className={styles.heroMainButton} disabled={BUTTONS_DISABLED}>
                    Crea tu negocio
                  </button>
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
                      src='/tangible_hero.png' // Replace with your actual image path
                      alt='Small Platform Preview'
                      fill
                      className={styles.carouselImage}
                      priority
                      objectFit='contain'
                    />
                  </div>
                </div>

                {/* Slide 2: Video */}
                <div className={styles.carouselSlide}>
                  <div className={styles.videoWrapper}>
                    <iframe
                      className={styles.videoIframe}
                      src='https://player.vimeo.com/video/1100402596?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479'
                      frameBorder='0'
                      allow='autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share'
                      title='VSL - Small'
                    ></iframe>
                  </div>
                  <div className={styles.videoBadge}>5 min y transforma tu vida</div>
                </div>
              </div>

              {/* Navigation dots */}
              <div className={styles.carouselDots}>
                <button
                  className={`${styles.dot} ${currentSlide === 0 ? styles.dotActive : ""}`}
                  onClick={() => setCurrentSlide(0)}
                ></button>
                <button
                  className={`${styles.dot} ${currentSlide === 1 ? styles.dotActive : ""}`}
                  onClick={() => setCurrentSlide(1)}
                ></button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className={styles.roadmapSection}>
        {/* Roadmap Figure */}
        <div className={styles.roadmapContainer}>
          <div className={styles.roadmapFigure}>
            <Image
              src='/images/roadmap_section_figure.png'
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
            <h2 className={styles.ctaTitle}>¿Listo para transformar tu negocio?</h2>
            <p className={styles.ctaDescription}>
              Únete a más de 500 negocios que ya transformaron su forma de trabajar.
              <span className={styles.ctaDescriptionBold}> Small de cero a todo</span>, y tu transformación comienza
              hoy.
            </p>
            <div className={styles.ctaButtons}>
              <Link href='/api/auth/login'>
                <button className={styles.ctaButton} disabled={BUTTONS_DISABLED}>
                  Comenzar Ahora - Gratis
                </button>
              </Link>
            </div>
            <p className={styles.ctaDisclaimer}>Sin compromiso • Soporte incluido</p>
          </div>
        </div>
      </section>

      {/* Platforms Section */}
      <section className={styles.platformSection}>
        <div style={{ width: "100%", display: "flex", flexDirection: "row", paddingBottom: "4rem" }}>
          <div
            style={{
              width: "50%",
              display: "flex",
              alignContent: "center",
              justifyContent: "center",
              color: "#7f7f7f",
              fontSize: "3.5rem",
              fontWeight: 800,
            }}
          >
            Del Video
          </div>
          <div
            style={{
              width: "50%",
              display: "flex",
              alignContent: "center",
              justifyContent: "center",
              color: "#ff5722",
              fontSize: "3.5rem",
              fontWeight: 800,
            }}
          >
            A la venta
          </div>
        </div>
        <div className={styles.platformContainer}>
          {/* Left side - First two images (50% width) */}
          <div className={styles.platformLeftGroup}>
            <div className={styles.platformFigure}>
              <div className={styles.platformFigureInner}>
                <Image
                  src='/app_video.png'
                  alt='Plataformas Small - Herramientas y soluciones digitales'
                  width={350}
                  height={708}
                  className={styles.platformImage}
                  priority
                />
              </div>
            </div>
            <div className={styles.platformFigure}>
              <div className={styles.platformFigureInner}>
                <Image
                  src='/tiktok.png'
                  alt='Plataformas Small - Herramientas y soluciones digitales'
                  width={310}
                  height={608}
                  className={styles.platformImage}
                  priority
                />
              </div>
            </div>
          </div>

          {/* Right side - Third image (50% width) */}
          <div className={styles.platformRightGroup}>
            <div className={styles.platformFigure}>
              <div className={styles.platformFigureInner}>
                <Image
                  src='/tienda.png'
                  alt='Plataformas Small - Herramientas y soluciones digitales'
                  fill
                  className={styles.platformImage}
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerGrid}>
            <div className={styles.footerLogoSection}>
              <div className={styles.logoContainer}>
                <Image src='/images/small-logo.png' alt='Small Logo' width={191} height={45} className={styles.logo} />
              </div>
              <p>Small de cero a todo. Transformamos ideas en negocios con IA. Gratis, simple y sin vueltas.</p>
            </div>

            <div className={styles.footerColumn}>
              <h4>Servicios</h4>
              <ul>
                <li>
                  <Link href='#'>Tienda Online</Link>
                </li>
                <li>
                  <Link href='#'>Gestión Digital</Link>
                </li>
                <li>
                  <Link href='#'>Marketing Digital</Link>
                </li>
                <li>
                  <Link href='#'>Soporte Técnico</Link>
                </li>
              </ul>
            </div>

            <div className={styles.footerColumn}>
              <h4>Empresa</h4>
              <ul>
                <li>
                  <Link href='#'>Sobre Nosotros</Link>
                </li>
                <li>
                  <Link href='#'>Casos de Éxito</Link>
                </li>
                <li>
                  <Link href='#'>Blog</Link>
                </li>
                <li>
                  <Link href='#'>Contacto</Link>
                </li>
              </ul>
            </div>

            <div className={styles.footerColumn}>
              <h4>Legal</h4>
              <ul>
                <li>
                  <Link href='#'>Términos de Uso</Link>
                </li>
                <li>
                  <Link href='#'>Política de Privacidad</Link>
                </li>
                <li>
                  <Link href='#'>Cookies</Link>
                </li>
              </ul>
            </div>
          </div>

          <div className={styles.footerBottom}>
            <p>© {new Date().getFullYear()} Small. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Vimeo Player Script */}
      <script src='https://player.vimeo.com/api/player.js'></script>
    </div>
  );
}
