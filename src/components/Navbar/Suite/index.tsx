import Image from "next/image";
import styles from "./styles.module.scss";
import small_logo from "/public/assets/small_logo.svg";
import uitool_logo from "/public/assets/logo_uitool.svg";
import uitrade_logo from "/public/assets/logo_uitrade.svg";
import inbox_logo from "/public/assets/logo_inbox.svg";
import uibox_logo from "/public/assets/logo_uibox.svg";
import notimation_logo from "/public/assets/notimation_logo_black.png";
import Link from "next/link";

const logos = [
  { title: "Small", href: "https://panel.small.ar", src: small_logo, alt: "Small Logo" },
  { title: "UITool", href: "https://uitool.com", src: uitool_logo, alt: "UITool Logo" },
  { title: "UITrade", href: "https://uitrade.com", src: uitrade_logo, alt: "UITrade Logo" },
  { title: "Inbox", href: "https://inbox.notimation.com", src: inbox_logo, alt: "Inbox Logo" },
  { title: "UIBox", href: "https://uibox.app", src: uibox_logo, alt: "UIBox Logo" },
  { title: "Notimation", href: "https://notimation.com", src: notimation_logo, alt: "Notimation Logo" },
];

const Suite = () => {
  const mainLogos = logos.slice(0, -1);
  const lastLogo = logos[logos.length - 1];

  return (
    <div className={styles.modal}>
      <div className={styles.container}>
        <div className={styles.inner_container}>
          {mainLogos.map((logo, index) => (
            <div key={index} className={styles.logo_container}>
              <Link href={logo.href} target='_blank'>
                <Image src={logo.src} alt={logo.alt} className={styles.logo} width={30} height={30} />
              </Link>
              <span>{logo.title}</span>
            </div>
          ))}
        </div>
        <div className={styles.company}>
          <Link href={lastLogo.href} target='_blank'>
            <Image src={lastLogo.src} alt={lastLogo.alt} className={styles.logo} width={150} height={150} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Suite;
