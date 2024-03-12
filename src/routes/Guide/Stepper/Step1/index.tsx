// Step1.js
"use client";
import React from "react";
import styles from "./styles.module.scss";

interface Step1Props {
  isActive: boolean;
  onClick: () => void;
}

const Step1: React.FC<Step1Props> = ({ isActive, onClick }) => {
  return (
    <div className={`${styles.container} ${isActive ? styles.active : styles.inactive}`} onClick={onClick}>
      <h1>Sección 1</h1>
      <p>Conocer, Jugar y Cargar</p>
    </div>
  );
};

export default Step1;
