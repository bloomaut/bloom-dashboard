import Image from "next/image";
import styles from "./styles.module.scss";
import small_logo from "/public/assets/small_logo.svg";
import uitool_logo from "/public/assets/logo_uitool.svg";
import uitrade_logo from "/public/assets/logo_uitrade.svg";
import inbox_logo from "/public/assets/logo_inbox.svg";
import uibox_logo from "/public/assets/logo_uibox.svg";
import notimation_logo from "/public/assets/notimation_logo_black.png";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useCloseDropdown } from "@/hooks/useCloseDropdown";
import { RefObject } from "react";

const logos = [
  { title: "Small", href: "https://panel.small.ar", src: small_logo, alt: "Small Logo" },
  { title: "UiTool", href: "https://uitool.com", src: uitool_logo, alt: "UiTool Logo" },
  { title: "UiTrade", href: "https://uitrade.com", src: uitrade_logo, alt: "UiTrade Logo" },
  { title: "Inbox", href: "https://inbox.notimation.com", src: inbox_logo, alt: "Inbox Logo" },
  { title: "UiBox", href: "https://uibox.app", src: uibox_logo, alt: "UiBox Logo" },
  { title: "Notimation", href: "https://notimation.com", src: notimation_logo, alt: "Notimation Logo" },
];

interface SuiteProps {
  setShowModal: (showModal: boolean) => void;
  buttonRef?: RefObject<HTMLButtonElement>;
}

const Suite = ({ setShowModal, buttonRef }: SuiteProps) => {
  const { user } = useUser();
  const { dropdownRef } = useCloseDropdown(setShowModal, buttonRef);

  const mainSuite = logos.slice(0, 5);
  const lastLogo = logos[logos.length - 1];

  return (
    <section className={user ? styles.modal_logged : styles.modal} ref={dropdownRef}>
      <article className={styles.container}>
        <div className={styles.inner_container}>
          {mainSuite.map((logo, index) => (
            <Link href={logo.href} target='_blank' style={{ gridArea: String(logo.title) }}>
              <div key={index} className={styles.logo_container}>
                <Image src={logo.src} alt={logo.alt} className={styles.logo} width={30} height={30} />
                <span>{logo.title}</span>
              </div>
            </Link>
          ))}
        </div>
      </article>
      <Link href={lastLogo.href} target='_blank'>
        <div className={styles.company}>
          <Image src={lastLogo.src} alt={lastLogo.alt} className={styles.logo} width={150} height={150} />
        </div>
      </Link>
    </section>
  );
};

export default Suite;
