import Banner from "./Banner";
import styles from "./styles.module.scss";
import { useState } from "react";
import PopupShare from "@/components/PopupShare";

const HomePage = () => {
  const [showPopup, setShowPopup] = useState(false);

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
