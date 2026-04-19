"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import styles from "./styles/pricing.module.scss";
import { usePathname } from "next/navigation";

export default function Pricing() {
  const dict = useTranslations("dict");
  const pathname = usePathname();
  const en = pathname.includes("/en");
  const apiDash = process.env.NEXT_PUBLIC_API_DASH;
  const apiDashBase =
    apiDash
      ?.trim()
      .replace(/\/+$/, "")
      .replace(/\/api$/, "") || "";
  const loginHref = apiDashBase ? `${apiDashBase}/api/auth/google` : `/api/auth/google`;

  const plans = [
    {
      name: dict("pricing.plans.free.name"),
      price: dict("pricing.plans.free.price"),
      period: dict("pricing.plans.free.period"),
      description: dict("pricing.plans.free.description"),
      features: [
        dict("pricing.plans.free.features.0"),
        dict("pricing.plans.free.features.1"),
        dict("pricing.plans.free.features.2"),
        dict("pricing.plans.free.features.3"),
        dict("pricing.plans.free.features.4"),
        dict("pricing.plans.free.features.5"),
        dict("pricing.plans.free.features.6"),
        dict("pricing.plans.free.features.7"),
        dict("pricing.plans.free.features.8"),
        dict("pricing.plans.free.features.9"),
        dict("pricing.plans.free.features.10"),
        dict("pricing.plans.free.features.11"),
      ],
      buttonText: dict("pricing.plans.free.button"),
      buttonVariant: "outline" as const,
      popular: false,
      actionType: "free",
    },
    {
      name: dict("pricing.plans.pro.name"),
      price: dict("pricing.plans.pro.price"),
      period: dict("pricing.plans.pro.period"),
      description: dict("pricing.plans.pro.description"),
      features: [
        dict("pricing.plans.pro.features.0"),
        dict("pricing.plans.pro.features.1"),
        dict("pricing.plans.pro.features.2"),
        dict("pricing.plans.pro.features.3"),
        dict("pricing.plans.pro.features.4"),
        dict("pricing.plans.pro.features.5"),
        dict("pricing.plans.pro.features.6"),
        dict("pricing.plans.pro.features.7"),
        dict("pricing.plans.pro.features.8"),
      ],
      buttonText: dict("pricing.plans.pro.button"),
      buttonVariant: "outline" as const,
      popular: true,
      comingSoon: false,
      actionType: "pro",
    },
    {
      name: dict("pricing.plans.ecommerce.name"),
      price: dict("pricing.plans.ecommerce.price"),
      period: dict("pricing.plans.ecommerce.period"),
      description: dict("pricing.plans.ecommerce.description"),
      features: [
        dict("pricing.plans.ecommerce.features.0"),
        dict("pricing.plans.ecommerce.features.1"),
        dict("pricing.plans.ecommerce.features.2"),
        dict("pricing.plans.ecommerce.features.3"),
        dict("pricing.plans.ecommerce.features.4"),
      ],
      buttonText: dict("pricing.plans.ecommerce.button"),
      buttonVariant: "outline" as const,
      popular: false,
      comingSoon: true,
      actionType: "ecommerce",
    },
  ];

  const handlePlanClick = (actionType: string) => {
    if (actionType === "free") {
      // Redirigir a la página de login/auth como en la landing page
      window.location.href = loginHref;
    }
    // Para pro y ecommerce no hacemos nada ya que están deshabilitados (coming soon)
  };

  const handleEnterpriseClick = () => {
    const subject = en ? "Enterprise Plan Inquiry - Bloomaut" : "Consulta Plan Enterprise - Bloomaut";

    const body = en
      ? `Hello Bloomaut Team,

I hope this message finds you well. I am writing to express my interest in learning more about your Enterprise plan and would like to schedule a conversation to discuss how Bloomaut can meet our organization's needs.

We are looking for a comprehensive solution that can scale with our business requirements, and your Enterprise offering seems to align perfectly with what we're seeking.

Could we arrange a time to discuss:
- Enterprise features and capabilities
- Pricing and implementation timeline
- Custom solutions for our specific use case
- Support and onboarding process

I would appreciate the opportunity to speak with your team at your earliest convenience.

Thank you for your time and consideration.

Best regards`
      : `Hola equipo de Bloomaut,

Espero que este mensaje los encuentre bien. Les escribo para expresar mi interés en conocer más sobre su plan Enterprise y me gustaría programar una conversación para discutir cómo Bloomaut puede satisfacer las necesidades de nuestra organización.

Estamos buscando una solución integral que pueda escalar con los requerimientos de nuestro negocio, y su oferta Enterprise parece alinearse perfectamente con lo que buscamos.

¿Podríamos coordinar un momento para discutir:
- Características y capacidades del plan Enterprise
- Precios y cronograma de implementación
- Soluciones personalizadas para nuestro caso específico
- Proceso de soporte y onboarding

Agradecería la oportunidad de hablar con su equipo a la mayor brevedad posible.

Gracias por su tiempo y consideración.

Saludos cordiales`;

    const mailtoLink = `mailto:hgazze0@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.badgeWrapper}>
            <div className={styles.headerBadge}>{dict("pricing.header.badge")}</div>
          </div>
          <h1 className={styles.title}>{dict("pricing.header.title")}</h1>
          <p className={styles.subtitle}>{dict("pricing.header.subtitle")}</p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className={styles.pricingSection}>
        <div className={styles.pricingContent}>
          <div className={styles.pricingGrid}>
            {plans.map((plan, index) => (
              <Card
                key={plan.name}
                className={`${styles.planCard} ${
                  plan.popular ? styles.popularCard : ""
                } ${plan.comingSoon ? styles.comingSoonCard : ""}`}
              >
                {plan.popular && (
                  <div className={styles.popularBadgeWrapper}>
                    <div className={styles.popularBadge}>{dict("pricing.popular_badge")}</div>
                  </div>
                )}

                <CardHeader className={styles.cardHeader}>
                  <CardTitle className={styles.planName}>{plan.name}</CardTitle>
                  <div className={styles.priceWrapper}>
                    <span className={styles.price}>{plan.price}</span>
                    <span className={styles.period}>/{plan.period}</span>
                  </div>
                  <CardDescription className={styles.planDescription}>{plan.description}</CardDescription>
                </CardHeader>

                <CardContent className={styles.cardContent}>
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className={styles.feature}>
                      <Check className={styles.checkIcon} />
                      <span className={styles.featureText}>{feature}</span>
                    </div>
                  ))}
                </CardContent>

                <CardFooter className={styles.cardFooter}>
                  <Button
                    variant={plan.buttonVariant}
                    className={styles.planButton}
                    disabled={plan.comingSoon}
                    size='lg'
                    onClick={() => handlePlanClick(plan.actionType)}
                  >
                    {plan.buttonText}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Enterprise Section */}
      <div className={styles.enterpriseSection}>
        <div className={styles.enterpriseContent}>
          <Card className={styles.enterpriseCard}>
            <CardHeader>
              <div className={styles.enterpriseHeader}>
                <div className={styles.enterpriseInfo}>
                  <CardTitle className={styles.enterpriseTitle}>{dict("pricing.enterprise.title")}</CardTitle>
                  <CardDescription className={styles.enterpriseDescription}>
                    {dict("pricing.enterprise.description")}
                  </CardDescription>
                </div>
                <Button variant='outline' size='lg' className={styles.enterpriseButton} onClick={handleEnterpriseClick}>
                  {dict("pricing.enterprise.button")}
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              <div className={styles.enterpriseFeatures}>
                <div className={styles.enterpriseColumn}>
                  <div className={styles.enterpriseFeature}>
                    <Check className={styles.checkIcon} />
                    <span className={styles.featureText}>{dict("pricing.enterprise.features.0")}</span>
                  </div>
                  <div className={styles.enterpriseFeature}>
                    <Check className={styles.checkIcon} />
                    <span className={styles.featureText}>{dict("pricing.enterprise.features.1")}</span>
                  </div>
                  <div className={styles.enterpriseFeature}>
                    <Check className={styles.checkIcon} />
                    <span className={styles.featureText}>{dict("pricing.enterprise.features.2")}</span>
                  </div>
                </div>
                <div className={styles.enterpriseColumn}>
                  <div className={styles.enterpriseFeature}>
                    <Check className={styles.checkIcon} />
                    <span className={styles.featureText}>{dict("pricing.enterprise.features.3")}</span>
                  </div>
                  <div className={styles.enterpriseFeature}>
                    <Check className={styles.checkIcon} />
                    <span className={styles.featureText}>{dict("pricing.enterprise.features.4")}</span>
                  </div>
                  <div className={styles.enterpriseFeature}>
                    <Check className={styles.checkIcon} />
                    <span className={styles.featureText}>{dict("pricing.enterprise.features.5")}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
