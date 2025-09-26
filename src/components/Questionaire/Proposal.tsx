import React from "react";
import ProposalData from "./proposal/ProposalData";
import ProposalActions from "./proposal/ProposalActions";
import { styles } from "./proposal/styles";
import { useTranslations } from "next-intl";

function Proposal() {
  const dict = useTranslations("dict.proposal");

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
          gridTemplateColumns: window.innerWidth >= 1024 ? "2fr 1fr" : "1fr",
          gap: "1rem",
        }}
      >
        {/* Main Content */}
        <ProposalData />
        {/* Actions */}
        <ProposalActions />
      </div>
    </div>
  );
}

export default Proposal;
