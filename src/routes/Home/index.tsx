import styles from "./styles.module.scss";
// Components
import Banner from "./Banner";
import TemplateList from "./TemplateList";

const HomePage = () => {
  return (
    <section className={styles.container}>
      <Banner />
      <TemplateList />
    </section>
  );
};

export default HomePage;
