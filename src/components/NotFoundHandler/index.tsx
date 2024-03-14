import styles from "./styles.module.scss";
import Link from "next/link";
import smallLogo from "@/../public/assets/Small.png";
import Image from "next/image";

const NotFoundHandler = () => {
  return (
    <html>
      <body>
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
