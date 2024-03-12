import { get } from "@/services/fetch";
import Banner from "./Banner";
import styles from "./styles.module.scss";
import { useEffect } from "react";
import useEnv from "@/hooks/useEnv";

const HomePage = () => {
  useEnv(".env.secondary");

  useEffect(() => {
    const handleFetch = async () => {
      try {
        const response = await get("user/me");
        if (response?.statusCode === 200) {
          console.log(response);
        }
      } catch (error) {
        console.log("Hacer algo con error", error);
      }
    };

    handleFetch();
  }, []);

  return (
    <section className={styles.container}>
      <Banner />
    </section>
  );
};

export default HomePage;
