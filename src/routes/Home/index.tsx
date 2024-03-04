import MobileCase from "@/components/MobileCase";
import styles from "./styles.module.scss";

const HomePage = () => {
  return (
    <>
      <h1>Home Page</h1>
      <MobileCase />
      <a href='/api/auth/logout'>Logout</a>
    </>
  );
};

export default HomePage;
