import Navbar from "@/components/Navbar";
import styles from "./styles.module.scss";
import { useTranslations } from "next-intl";

const Login = () => {
  const dict = useTranslations("dict.login");
  return (
    <section className={styles.container}>
      <Navbar />
      {/*  <a href='/api/auth/login'>Login</a> */}
      <div className={styles.inner_container}>
        <div className={styles.left_section}>
          <h1 className={styles.title}>
            <span className={styles.small}>Small</span>
            {dict("title")}
          </h1>
        </div>
        <div>
          <div>arriba</div>
          <div>abajo</div>
        </div>
      </div>
    </section>
  );
};

export default Login;
