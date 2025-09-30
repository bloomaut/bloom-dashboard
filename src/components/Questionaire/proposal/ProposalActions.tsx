"use client";
import { Download, HelpCircle, MessageCircle } from "lucide-react";
import React, { useState } from "react";
import { styles } from "./styles";
import { approveProposal } from "@/services/fetch";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

function ProposalActions() {
  const router = useRouter();
  const dict = useTranslations("dict.proposal");
  const [checked, setChecked] = useState(false);
  const handleClick = () => {
    approveProposal();
    router.push("/");
  };
  return (
    <div style={styles.sidebar}>
      {/* Actions */}
      <div style={styles.sidebarCard}>
        <h4 style={styles.sidebarTitle}>{dict("actions_title")}</h4>

        <div style={styles.checkboxContainer}>
          <input type='checkbox' style={styles.checkbox} onChange={() => setChecked(!checked)} id='terms-checkbox' />
          <label htmlFor='terms-checkbox'>{dict("terms_acceptance")}</label>
        </div>

        <button
          style={{
            ...styles.continueButton,
            backgroundColor: !checked ? "#cbd5e1" : "var(--color-primary)",
          }}
          disabled={!checked}
          onClick={handleClick}
        >
          <p style={{ color: !checked ? "#475569" : "#FFFFFF" }}>{dict("continue_proposal")}</p>
        </button>

        <button style={styles.secondaryButton}>
          <MessageCircle size={"1.7rem"} color='#FFFFFF' />
          <p style={{ color: "#FFFFFF" }}>{dict("give_feedback")}</p>
        </button>
      </div>

      {/* Help Section */}
      <div style={styles.helpSection}>
        <HelpCircle style={styles.helpIcon} />
        <h4 style={styles.helpTitle}>{dict("need_help")}</h4>
        <p style={styles.helpText}>{dict("help_description")}</p>
        <button style={styles.helpButton}>{dict("contact_support")}</button>
      </div>
    </div>
  );
}

export default ProposalActions;