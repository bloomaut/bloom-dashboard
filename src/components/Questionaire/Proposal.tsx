import React from "react";
import ProposalData from "./proposal/ProposalData";
import ProposalActions from "./proposal/ProposalActions";
import { styles } from "./proposal/styles";
import { useTranslations } from "next-intl";
import { UserBusiness } from "@/typescript/interfaces/business.interface";

type Props = {
  user: UserBusiness;
};

function Proposal({ user }: Props) {
  const pdfFile = user.client.proposal_url;
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
        <ProposalData pdfFile={pdfFile} />
        {/* Actions */}
        <ProposalActions />
      </div>
    </div>
  );
}

export default Proposal;
