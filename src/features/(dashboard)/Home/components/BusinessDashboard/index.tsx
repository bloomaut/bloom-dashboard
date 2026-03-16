"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Globe, FileText, Download, CheckCircle, Clock } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { userState } from "@/store/features/userSlice";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import styles from "./styles.module.scss";
import { buildBusinessDashboardModel } from "./model";

export function BusinessDashboard() {
  const userData = useAppSelector(userState);
  const dict = useTranslations("dict.business_dashboard");
  const model = buildBusinessDashboardModel(userData.client);

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

  const basicFields = model.basicFields.map(f => ({
    ...f,
    icon: f.key === "fields.address" ? MapPin : f.key === "fields.website" ? Globe : FileText,
  }));

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
                {basicFields.length === 0 ? (
                  <p className={styles.field_value}>{dict("fields.not_specified")}</p>
                ) : (
                  basicFields.map(field => (
                    <div key={field.key} className={styles.info_field}>
                      <label className={styles.field_label}>
                        <field.icon className={styles.label_icon} />
                        {dict(field.key)}
                      </label>
                      <p className={styles.field_value}>
                        {field.href ? (
                          <a href={field.href} target='_blank' rel='noopener noreferrer' className={styles.info_link}>
                            {field.value}
                          </a>
                        ) : (
                          field.value
                        )}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Branding */}
          {model.branding.hasData && (
            <Card className={styles.settings_card}>
              <CardHeader className={styles.card_header}>
                <CardTitle className={styles.card_title}>
                  <FileText className={styles.title_icon} />
                  {dict("sections.branding")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={styles.user_info_grid}>
                  {model.branding.logo && (
                    <div className={styles.info_field}>
                      <label className={styles.field_label}>
                        <FileText className={styles.label_icon} />
                        {dict("fields.company_logo")}
                      </label>
                      <div className={styles.logo_display}>
                        <img src={model.branding.logo} alt={dict("branding.logo_alt")} className={styles.logo_image} />
                      </div>
                    </div>
                  )}

                  {model.branding.paletteArray && model.branding.paletteArray.length > 0 && (
                    <div className={styles.info_field}>
                      <label className={styles.field_label}>
                        <FileText className={styles.label_icon} />
                        {dict("fields.color_palette")}
                      </label>
                      <div className={styles.color_palette}>
                        {model.branding.paletteArray.map((colorItem, index) => (
                          <div key={index} className={styles.color_item}>
                            <div className={styles.color_circle} style={{ backgroundColor: colorItem.color }} />
                            <div className={styles.color_input_group}>
                              <span className={styles.color_label}>{colorItem.name}</span>
                              <span className={styles.color_value}>{colorItem.color}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Propuesta Comercial */}
          {model.proposalUrl && (
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
                    <div className={styles.button_group}>
                      <Button
                        className={styles.download_button}
                        onClick={() => window.open(model.proposalUrl as string, "_blank")}
                      >
                        <Download className='h-4 w-4 mr-2' />
                        {dict("proposal.download_pdf")}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
