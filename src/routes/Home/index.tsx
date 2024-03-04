import MobileCase from "@/components/MobileCase";
import styles from "./styles.module.scss";
import Opengraph from "@/components/OpenGraph";

const HomePage = () => {
  return (
    <>
      <h1>Home Page</h1>
      <MobileCase />
      <br />
      <Opengraph />
      <a href='/api/auth/logout'>Logout</a>
    </>
  );
};

export default HomePage;
