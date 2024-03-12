// Step2.js
"use client";
import React from "react";
import styles from "./styles.module.scss";

interface Step1Props {
  isActive: boolean;
  onClick: () => void;
}

const Step2: React.FC<Step1Props> = ({ isActive, onClick }) => {
  return (
    <div className={`${styles.container} ${isActive ? styles.active : styles.inactive}`} onClick={onClick}>
      <h1>Sección 2</h1>
      <p>Compartir y Utilizar</p>
    </div>
  );
};

export default Step2;
