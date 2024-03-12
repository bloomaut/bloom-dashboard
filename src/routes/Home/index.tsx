import { get } from "@/services/fetch";
import Banner from "./Banner";
import styles from "./styles.module.scss";
import { useEffect } from "react";

const HomePage = () => {
  useEffect(() => {
    const handleFetch = async () => {
      try {
        const response = await get("history", "NEXT_PUBLIC_API_DASH");
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
