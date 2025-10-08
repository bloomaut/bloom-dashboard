"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import styles from "./styles/pricing.module.scss";

export default function PricingPage() {
  const dict = useTranslations("dict");

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
      buttonVariant: "default" as const,
      popular: true,
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
    if (actionType === "free" || actionType === "pro") {
      // Redirigir a la página de login/auth como en la landing page
      window.location.href = "/api/auth/login";
    }
    // Para ecommerce no hacemos nada ya que está deshabilitado (coming soon)
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
                <Button variant='outline' size='lg' className={styles.enterpriseButton}>
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
