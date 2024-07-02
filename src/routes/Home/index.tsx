import styles from "./styles.module.scss";
// Components
import Banner from "./Banner";
import Templates from "./Templates";

const HomePage = () => {
  return (
    <section className={styles.container}>
      <Banner />
      <Templates />
    </section>
  );
};

export default HomePage;
