"use client";
import Image from "next/image";
import Link from "next/link";
import styles from "./styles/about.module.scss";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

export default function About() {
  const dict = useTranslations("dict");
  const pathname = usePathname();
  const en = pathname.includes("/en");
  const locale = en ? "en" : "es";

  const teamMembers = [
    {
      id: "jose",
      image: "/jose_vigil.png",
      name: dict("about.team.members.jose.name"),
      role: dict("about.team.members.jose.role"),
    },
    {
      id: "homero",
      image: "/homero_gazze.png",
      name: dict("about.team.members.homero.name"),
      role: dict("about.team.members.homero.role"),
    },
    {
      id: "franco",
      image: "/franco_rodriguez.png",
      name: dict("about.team.members.franco.name"),
      role: dict("about.team.members.franco.role"),
    },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link href={`/${locale}`}>
            <Image
              src='/logotipo_horizontal.png'
              alt='Bloomaut'
              width={331}
              height={74}
              className={styles.headerLogo}
              priority
            />
          </Link>
          <Link href={`/${locale}`}>
            <button className={styles.headerButton}>{dict("header.pricing")}</button>
          </Link>
        </div>
      </header>

      <main className={styles.content}>
        <section className={styles.section}>
          <h1 className={styles.title}>{dict("about.title")}</h1>
          <div className={styles.introContent}>
            <h2 className={styles.subtitle}>{dict("about.intro.title")}</h2>
            <p className={styles.description}>{dict("about.intro.description")}</p>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.subtitle}>{dict("about.team.title")}</h2>
          <div className={styles.teamGrid}>
            {teamMembers.map(member => (
              <div key={member.id} className={styles.memberCard}>
                <div className={styles.imageWrapper}>
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes='(max-width: 768px) 100vw, 200px'
                  />
                </div>
                <h3 className={styles.memberName}>{member.name}</h3>
                <p className={styles.memberRole}>{member.role}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
