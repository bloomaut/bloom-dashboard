import styles from "./styles.module.scss";
// Components
import Banner from "./Banner";
import Icon from "@/components/Icon";

const HomePage = () => {
  return (
    <section className={styles.container}>
      <Banner />
      <Icon
        name='clients'
        width={25}
        height={25}
        strokeColor='#381d2a'
        strokeWidth={1.8}
        fillColor='#fff'
        className='mi_svg'
      />
    </section>
  );
};

export default HomePage;
