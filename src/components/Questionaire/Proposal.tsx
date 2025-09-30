import React from "react";
import ProposalData from "./proposal/ProposalData";
import ProposalActions from "./proposal/ProposalActions";
import { styles } from "./proposal/styles";
import { UserBusiness } from "@/typescript/interfaces/business.interface";

type Props = {
  user: UserBusiness;
};

function Proposal({ user }: Props) {
  const pdfFile = user.client.proposal_url;
  return (
    <div style={styles.container}>
      <div style={styles.maxWidth}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>Tu Propuesta Está Lista</h1>
          <p style={styles.subtitle}>Revisa tu propuesta personalizada y procede con los siguientes pasos</p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: window.innerWidth >= 1024 ? "2fr 1fr" : "1fr",
            gap: "24px",
          }}
        >
          {/* Main Content */}
          <ProposalData pdfFile={pdfFile} />
          {/* Actions */}
          <ProposalActions />
        </div>
      </div>
    </div>
  );
}

export default Proposal;
