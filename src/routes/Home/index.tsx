import styles from "./styles.module.scss";
// Components
import Banner from "./Banner";

const HomePage = () => {
  return (
    <section className={styles.container}>
      <Banner />
    </section>
  );
};

export default HomePage;
