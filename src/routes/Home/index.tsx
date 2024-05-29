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
        width={40}
        height={40}
        viewBox='0 0 51 51'
        strokeColor='#381d2a'
        strokeWidth={1.8}
        fillColor='#fff'
        className='mi_svg'
      />
    </section>
  );
};

export default HomePage;
