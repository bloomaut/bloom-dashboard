import MobileCase from "@/components/MobileCase";
import styles from "./styles.module.scss";

const HomePage = () => {
  return (
    <>
      <div className={styles.home}>
        {/*<h1>Home Page</h1> */}
        <MobileCase />
        <a href='/api/auth/logout'>Logout</a>
      </div>
    </>
  );
};

export default HomePage;
