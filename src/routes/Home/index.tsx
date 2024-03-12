import { get } from "@/services/fetch";
import Banner from "./Banner";
import styles from "./styles.module.scss";
import PopupShare from "@/components/PopupShare";
import { useState, useEffect } from "react";

const HomePage = () => {
  const [showPopup, setShowPopup] = useState(false);

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

  const handleShare = () => {
    setShowPopup(!showPopup);
  };

  return (
    <section className={styles.container}>
      <Banner />
      <button onClick={handleShare}>Abrir Popup</button>
      {showPopup && <PopupShare setShowPopup={setShowPopup} />}
    </section>
  );
};

export default HomePage;
