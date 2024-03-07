"use client";
import { useState } from "react";
import Image from "next/image";
import styles from "./styles.module.scss";
import suiteUitool from "../assets/dropdown_uitool.svg";
import suiteUitrade from "../assets/dropdown_uitrade.svg";
import suiteDashboard from "../assets/dropdown_dashboard.svg";
import { useCloseDrop } from "../hooks/useCloseDrop";
import { List } from "./list";

interface Props {
  app: "uitool" | "uitrade" | "dashboard";
}
enum Colors {
  uitool_bg = "#000000",
  uitool_suite_bg = "#818181",
  uitrade_bg = "#F1F1F1",
  uitrade_suite_bg = "#F1F1F1",
  dashboard_bg = `linear-gradient(
    125deg,
    rgba(87, 45, 237, 1) 0%,
    rgba(82, 141, 255, 1) 100%
  )`,
  dashboard_suite_bg = "#434343",
}

export const Dropdown = ({ app }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const { tagRef } = useCloseDrop(setIsOpen);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  /* Condicional para cambiar estilos del dropdown*/
  let dropdown_bg: string;
  let suite_bg: string;
  let suite_Icon: string;

  if (app === "uitool") {
    dropdown_bg = Colors.uitool_bg;
    suite_bg = Colors.uitool_suite_bg;
    suite_Icon = suiteUitool;
  } else if (app === "uitrade") {
    dropdown_bg = Colors.uitrade_bg;
    suite_bg = Colors.uitrade_suite_bg;
    suite_Icon = suiteUitrade;
  } else {
    dropdown_bg = Colors.dashboard_bg;
    suite_bg = Colors.dashboard_suite_bg;
    suite_Icon = suiteDashboard;
  }

  return (
    <div
      className={`${styles.container} ${app === "uitrade" && "border border-[#888888]"}`}
      onClick={toggleDropdown}
      ref={tagRef}
      style={{ background: suite_bg }}
    >
      <Image src={suite_Icon} className={styles.img} alt='Dropdown Image' />
      {isOpen && (
        <div className={styles.dropdownMenu} style={{ background: dropdown_bg }}>
          <List app={app} />
        </div>
      )}
    </div>
  );
};
