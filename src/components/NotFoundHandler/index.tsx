import "@/styles/globals.scss";
import styles from "./styles.module.scss";
import Image from "next/image";
import Link from "next/link";
import smallLogo from "@/../public/assets/logo_small.png";
import { Barlow } from "next/font/google";

const barlow = Barlow({
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const NotFoundHandler = () => {
  return (
    <html>
      <body className={barlow.className}>
        <div className={styles.container}>
          <Image src={smallLogo} alt='' />
          <h1>Oops! Page not found</h1>
          <Link href={"/"} className={styles.btn}>
            Go Back
          </Link>
        </div>
      </body>
    </html>
  );
};

export default NotFoundHandler;
