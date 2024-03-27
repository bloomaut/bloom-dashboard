"use client";
import styles from "./styles.module.scss";
import { useTranslations } from "next-intl";
//Componentes
import Breadcrumb from "@/components/Breadcrumb";
import IntroVideo from "@/components/IntroVideo";
import Checkbox from "./Checkbox";

interface Content {
  title: string;
  description: string;
}

const IntroductionPage = () => {
  const dict = useTranslations("dict.introduction");

  const content: Content[] = [
    {
      title: "H2 sub",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed consequat, ligula sed efficitur malesuada, massa ex faucibus odio, sed tempor lacus urna at purus. Nam vehicula dui vel ex gravida, sed dignissim turpis bibendum. Vivamus euismod finibus tortor, sit amet sollicitudin nisl accumsan a. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed consequat, ligula sed efficitur malesuada, massa ex faucibus odio, sed tempor lacus urna at purus. Nam vehicula dui vel ex gravida, sed dignissim turpis bibendum. Vivamus euismod finibus tortor, sit amet sollicitudin nisl accumsan a. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed consequat, ligula sed efficitur malesuada, massa ex faucibus odio, sed tempor lacus urna at purus. Nam vehicula dui vel ex gravida, sed dignissim turpis bibendum. Vivamus euismod finibus tortor, sit amet sollicitudin nisl accumsan a.",
    },
    {
      title: "H2 sub",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed consequat, ligula sed efficitur malesuada, massa ex faucibus odio, sed tempor lacus urna at purus. Nam vehicula dui vel ex gravida, sed dignissim turpis bibendum. Vivamus euismod finibus tortor, sit amet sollicitudin nisl accumsan a. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed consequat, ligula sed efficitur malesuada, massa ex faucibus odio, sed tempor lacus urna at purus. Nam vehicula dui vel ex gravida, sed dignissim turpis bibendum. Vivamus euismod finibus tortor, sit amet sollicitudin nisl accumsan a. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed consequat, ligula sed efficitur malesuada, massa ex faucibus odio, sed tempor lacus urna at purus. Nam vehicula dui vel ex gravida, sed dignissim turpis bibendum. Vivamus euismod finibus tortor, sit amet sollicitudin nisl accumsan a.",
    },
    {
      title: "H2 sub",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed consequat, ligula sed efficitur malesuada, massa ex faucibus odio, sed tempor lacus urna at purus. Nam vehicula dui vel ex gravida, sed dignissim turpis bibendum. Vivamus euismod finibus tortor, sit amet sollicitudin nisl accumsan a. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed consequat, ligula sed efficitur malesuada, massa ex faucibus odio, sed tempor lacus urna at purus. Nam vehicula dui vel ex gravida, sed dignissim turpis bibendum. Vivamus euismod finibus tortor, sit amet sollicitudin nisl accumsan a. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed consequat, ligula sed efficitur malesuada, massa ex faucibus odio, sed tempor lacus urna at purus. Nam vehicula dui vel ex gravida, sed dignissim turpis bibendum. Vivamus euismod finibus tortor, sit amet sollicitudin nisl accumsan a.",
    },
    {
      title: "H2 sub",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed consequat, ligula sed efficitur malesuada, massa ex faucibus odio, sed tempor lacus urna at purus. Nam vehicula dui vel ex gravida, sed dignissim turpis bibendum. Vivamus euismod finibus tortor, sit amet sollicitudin nisl accumsan a. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed consequat, ligula sed efficitur malesuada, massa ex faucibus odio, sed tempor lacus urna at purus. Nam vehicula dui vel ex gravida, sed dignissim turpis bibendum. Vivamus euismod finibus tortor, sit amet sollicitudin nisl accumsan a. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed consequat, ligula sed efficitur malesuada, massa ex faucibus odio, sed tempor lacus urna at purus. Nam vehicula dui vel ex gravida, sed dignissim turpis bibendum. Vivamus euismod finibus tortor, sit amet sollicitudin nisl accumsan a.",
    },
    {
      title: "H2 sub",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed consequat, ligula sed efficitur malesuada, massa ex faucibus odio, sed tempor lacus urna at purus. Nam vehicula dui vel ex gravida, sed dignissim turpis bibendum. Vivamus euismod finibus tortor, sit amet sollicitudin nisl accumsan a. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed consequat, ligula sed efficitur malesuada, massa ex faucibus odio, sed tempor lacus urna at purus. Nam vehicula dui vel ex gravida, sed dignissim turpis bibendum. Vivamus euismod finibus tortor, sit amet sollicitudin nisl accumsan a. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed consequat, ligula sed efficitur malesuada, massa ex faucibus odio, sed tempor lacus urna at purus. Nam vehicula dui vel ex gravida, sed dignissim turpis bibendum. Vivamus euismod finibus tortor, sit amet sollicitudin nisl accumsan a.",
    },
    {
      title: "H2 sub",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed consequat, ligula sed efficitur malesuada, massa ex faucibus odio, sed tempor lacus urna at purus. Nam vehicula dui vel ex gravida, sed dignissim turpis bibendum. Vivamus euismod finibus tortor, sit amet sollicitudin nisl accumsan a. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed consequat, ligula sed efficitur malesuada, massa ex faucibus odio, sed tempor lacus urna at purus. Nam vehicula dui vel ex gravida, sed dignissim turpis bibendum. Vivamus euismod finibus tortor, sit amet sollicitudin nisl accumsan a. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed consequat, ligula sed efficitur malesuada, massa ex faucibus odio, sed tempor lacus urna at purus. Nam vehicula dui vel ex gravida, sed dignissim turpis bibendum. Vivamus euismod finibus tortor, sit amet sollicitudin nisl accumsan a.",
    },
    {
      title: "H2 sub",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed consequat, ligula sed efficitur malesuada, massa ex faucibus odio, sed tempor lacus urna at purus. Nam vehicula dui vel ex gravida, sed dignissim turpis bibendum. Vivamus euismod finibus tortor, sit amet sollicitudin nisl accumsan a. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed consequat, ligula sed efficitur malesuada, massa ex faucibus odio, sed tempor lacus urna at purus. Nam vehicula dui vel ex gravida, sed dignissim turpis bibendum. Vivamus euismod finibus tortor, sit amet sollicitudin nisl accumsan a. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed consequat, ligula sed efficitur malesuada, massa ex faucibus odio, sed tempor lacus urna at purus. Nam vehicula dui vel ex gravida, sed dignissim turpis bibendum. Vivamus euismod finibus tortor, sit amet sollicitudin nisl accumsan a.",
    },
    {
      title: "H2 sub",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed consequat, ligula sed efficitur malesuada, massa ex faucibus odio, sed tempor lacus urna at purus. Nam vehicula dui vel ex gravida, sed dignissim turpis bibendum. Vivamus euismod finibus tortor, sit amet sollicitudin nisl accumsan a. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed consequat, ligula sed efficitur malesuada, massa ex faucibus odio, sed tempor lacus urna at purus. Nam vehicula dui vel ex gravida, sed dignissim turpis bibendum. Vivamus euismod finibus tortor, sit amet sollicitudin nisl accumsan a. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed consequat, ligula sed efficitur malesuada, massa ex faucibus odio, sed tempor lacus urna at purus. Nam vehicula dui vel ex gravida, sed dignissim turpis bibendum. Vivamus euismod finibus tortor, sit amet sollicitudin nisl accumsan a.",
    },
    {
      title: "H2 sub",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed consequat, ligula sed efficitur malesuada, massa ex faucibus odio, sed tempor lacus urna at purus. Nam vehicula dui vel ex gravida, sed dignissim turpis bibendum. Vivamus euismod finibus tortor, sit amet sollicitudin nisl accumsan a. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed consequat, ligula sed efficitur malesuada, massa ex faucibus odio, sed tempor lacus urna at purus. Nam vehicula dui vel ex gravida, sed dignissim turpis bibendum. Vivamus euismod finibus tortor, sit amet sollicitudin nisl accumsan a. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed consequat, ligula sed efficitur malesuada, massa ex faucibus odio, sed tempor lacus urna at purus. Nam vehicula dui vel ex gravida, sed dignissim turpis bibendum. Vivamus euismod finibus tortor, sit amet sollicitudin nisl accumsan a.",
    },
  ];

  return (
    <section className={styles.container}>
      <div className={styles.breadcrumb_container}>
        <Breadcrumb title={dict("title")} />
      </div>
      <div className={styles.inner_container}>
        <div className={styles.content}>
          {content.map((noticia, index) => (
            <div key={index}>
              <h2 className={styles.title}>{noticia.title}</h2>
              <p className={styles.description}>{noticia.description}</p>
            </div>
          ))}
        </div>
        <div className={styles.video}>
          <IntroVideo />
        </div>
      </div>
      <div className={styles.checkbox}>
        <Checkbox />
      </div>
    </section>
  );
};

export default IntroductionPage;
