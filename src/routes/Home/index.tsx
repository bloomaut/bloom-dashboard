import styles from "./styles.module.scss";
import MobileCase from "./MobileCase";

const HomePage = () => {
  return (
    <div className={styles.container}>
      <MobileCase />
      <a href='/api/auth/logout'>Logout</a>
    </div>
  );
};

export default HomePage;
