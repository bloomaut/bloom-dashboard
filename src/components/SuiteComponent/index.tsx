import styles from "./styles.module.scss";
import Image from "next/image";
import Suite from "./Suite";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";

const SuiteComponent = () => {
  const [showModal, setShowModal] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <div className={styles.suite_container}>
      <button className={styles.suite} ref={buttonRef} onClick={() => setShowModal(prev => !prev)}>
        <Image src='/assets/suite.svg' alt='bars' width={30} height={30} />
      </button>
      {showModal && createPortal(<Suite setShowModal={setShowModal} buttonRef={buttonRef} />, document.body)}
    </div>
  );
};

export default SuiteComponent;
