import styles from "./styles.module.scss";
import HogCard from "../HogCard";
import { useEffect, useState } from "react";
import { get } from "@/services/fetch";
import { HogRelated } from "@/typescript/interfaces/flakes.interface";

const PowerApp = () => {
  const [hogs, setHogs] = useState<HogRelated[]>([]);

  useEffect(() => {
    const getHogs = async () => {
      const response = await get("designs/powerapps");
      console.log(response);
      if (response.statusCode === 200) {
        setHogs(response.result.powerApps);
      }
    };

    getHogs();
  }, []);

  console.log(hogs);

  return (
    <section className={styles.powerapp_container}>
      <h3 className={styles.subtitle}>Diffusion templates</h3>
      <div className={styles.hog_container}>
        {hogs.length > 1 && hogs.map(hog => <HogCard key={hog._id} {...hog} />)}
      </div>
    </section>
  );
};

export default PowerApp;
