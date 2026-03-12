"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Globe, FileText, Download, CheckCircle, Clock, ExternalLink } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { userState } from "@/store/features/userSlice";
import { parsePaletteString } from "@/typescript/interfaces/business.interface";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import styles from "./styles.module.scss";

export function BusinessDashboard() {
  const userData = useAppSelector(userState);
  const clientData = userData.client;
  const dict = useTranslations("dict.business_dashboard");

  // Convertir la paleta de string a array para mostrar
  const paletteArray = parsePaletteString(clientData?.palette ?? null);

  // Función para obtener el estado de la propuesta
  const getProposalStatus = (status: string) => {
    switch (status) {
      case "approved":
        return { text: dict("proposal.status.approved"), icon: CheckCircle, color: "text-green-600" };
      case "pending":
        return { text: dict("proposal.status.pending"), icon: Clock, color: "text-yellow-600" };
      default:
        return { text: dict("proposal.status.review"), icon: Clock, color: "text-gray-600" };
    }
  };

  const proposalStatus = getProposalStatus(
    ["BRAND_COMPLETED", "SOCIAL_CONNECTED", "ONBOARDING_COMPLETED"].includes(userData.onboarding_status)
      ? "approved"
      : "pending",
  );

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.header_content}>
          <div className={styles.header_title}>{dict("header.default_title")}</div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.main_content}>
          {/* Información Básica */}
          <Card className={styles.settings_card}>
            <CardHeader className={styles.card_header}>
              <CardTitle className={styles.card_title}>
                <FileText className={styles.title_icon} />
                {dict("sections.basic_data")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles.user_info_grid}>
                <div className={styles.info_field}>
                  <label className={styles.field_label}>
                    <FileText className={styles.label_icon} />
                    {dict("fields.business_name")}
                  </label>
                  <p className={styles.field_value}>{clientData?.name || dict("fields.not_specified")}</p>
                </div>

                <div className={styles.info_field}>
                  <label className={styles.field_label}>
                    <FileText className={styles.label_icon} />
                    {dict("fields.category")}
                  </label>
                  <p className={styles.field_value}>{clientData?.category || dict("fields.not_specified")}</p>
                </div>

                <div className={styles.info_field}>
                  <label className={styles.field_label}>
                    <FileText className={styles.label_icon} />
                    {dict("fields.description")}
                  </label>
                  <p className={styles.field_value}>{clientData?.description || dict("fields.not_specified")}</p>
                </div>

                <div className={styles.info_field}>
                  <label className={styles.field_label}>
                    <MapPin className={styles.label_icon} />
                    {dict("fields.address")}
                  </label>
                  <p className={styles.field_value}>{clientData?.address || dict("fields.not_specified")}</p>
                </div>

                <div className={styles.info_field}>
                  <label className={styles.field_label}>
                    <Globe className={styles.label_icon} />
                    {dict("fields.website")}
                  </label>
                  <p className={styles.field_value}>
                    {clientData?.company_web ? (
                      <a
                        href={clientData.company_web}
                        target='_blank'
                        rel='noopener noreferrer'
                        className={styles.info_link}
                      >
                        {clientData.company_web}
                      </a>
                    ) : (
                      dict("fields.not_specified")
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Branding */}
          <Card className={styles.settings_card}>
            <CardHeader className={styles.card_header}>
              <CardTitle className={styles.card_title}>
                <FileText className={styles.title_icon} />
                {dict("sections.branding")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles.user_info_grid}>
                <div className={styles.info_field}>
                  <label className={styles.field_label}>
                    <FileText className={styles.label_icon} />
                    {dict("fields.company_logo")}
                  </label>
                  <div className={styles.logo_display}>
                    {clientData?.logo ? (
                      <img src={clientData.logo} alt={dict("branding.logo_alt")} className={styles.logo_image} />
                    ) : (
                      <div className={styles.logo_placeholder}>
                        <FileText className={styles.placeholder_icon} />
                        <span>{dict("branding.no_logo_configured")}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.info_field}>
                  <label className={styles.field_label}>
                    <FileText className={styles.label_icon} />
                    {dict("fields.color_palette")}
                  </label>
                  <div className={styles.color_palette}>
                    {paletteArray && paletteArray.length > 0 ? (
                      paletteArray.map((colorItem, index) => (
                        <div key={index} className={styles.color_item}>
                          <div className={styles.color_circle} style={{ backgroundColor: colorItem.color }} />
                          <div className={styles.color_input_group}>
                            <span className={styles.color_label}>{colorItem.name}</span>
                            <span className={styles.color_value}>{colorItem.color}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className={styles.palette_placeholder}>
                        <span>{dict("branding.no_palette_configured")}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Propuesta Comercial */}
          <Card className={styles.settings_card}>
            <CardHeader className={styles.card_header}>
              <CardTitle className={styles.card_title}>
                <FileText className={styles.title_icon} />
                {dict("sections.commercial_proposal")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles.actions_section}>
                <div className={styles.document_item}>
                  <div className={styles.document_content}>
                    <div className={styles.document_icon}>
                      <FileText className={styles.document_icon_svg} />
                    </div>
                    <div>
                      <div className={styles.document_header}>
                        <h4 className={styles.document_title}>{dict("proposal.title")}</h4>
                        <div className={`${styles.status_badge} ${proposalStatus.color}`}>
                          <proposalStatus.icon className={styles.status_icon} />
                          <span className={styles.status_text}>{proposalStatus.text}</span>
                        </div>
                      </div>
                      <p className={styles.document_description}>
                        {dict("proposal.status_label")}: {proposalStatus.text} • {dict("proposal.auto_generated")}
                      </p>
                    </div>
                  </div>
                  {clientData?.proposal_url && (
                    <div className={styles.button_group}>
                      <Button
                        className={styles.download_button}
                        onClick={() => clientData.proposal_url && window.open(clientData.proposal_url, "_blank")}
                      >
                        <Download className='h-4 w-4 mr-2' />
                        {dict("proposal.download_pdf")}
                      </Button>
                    </div>
                  )}
                </div>

                <div className={styles.info_box}>
                  <p className={styles.info_content}>
                    <span>💡</span>
                    <span>
                      {clientData?.proposal_status === "approved"
                        ? dict("proposal.approved_message")
                        : dict("proposal.auto_update_message")}
                    </span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
