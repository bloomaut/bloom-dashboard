"use client";
import React from "react";
import ProposalData from "./components/ProposalData";
import ProposalActions from "./components/ProposalActions";
import styles from "./styles.module.scss";
import { useAppSelector } from "@/store/hooks";

function Review() {
  const user = useAppSelector(state => state.userData);
  const pdfFile = user?.client?.proposal_url || null;

  return (
    <div className={styles.container}>
      <div className={styles.gridLayout}>
        {/* Main Content */}
        <ProposalData pdfFile={pdfFile} />
        {/* Actions */}
        <ProposalActions />
      </div>
    </div>
  );
}

export default Review;
