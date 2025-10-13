"use client";
import React from "react";
import ProposalData from "./components/ProposalData";
import ProposalActions from "./components/ProposalActions";
import { styles } from "./styles/styles";
import { useTranslations } from "next-intl";
import { useAppSelector } from "@/store/hooks";

function Review() {
  const user = useAppSelector(state => state.userData);
  const pdfFile = user?.client?.proposal_url || null;
  const dict = useTranslations("dict.proposal");
  const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h4 style={styles.title}>{dict("title")}</h4>
        <p style={styles.subtitle}>{dict("subtitle")}</p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isDesktop ? "2fr 1fr" : "1fr",
          gap: "1rem",
        }}
      >
        {/* Main Content */}
        <ProposalData pdfFile={pdfFile} />
        {/* Actions */}
        <ProposalActions />
      </div>
    </div>
  );
}

export default Review;
