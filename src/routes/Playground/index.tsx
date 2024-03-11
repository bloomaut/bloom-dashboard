"use client";
import styles from "./styles.module.scss";
import Breadcrumb from "@/components/Breadcrumb";
import IntroVideo from "@/components/IntroVideo";

interface Content {
  title: string;
  description: string;
}

const Playground = () => {
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
        <Breadcrumb title={"Simulador"} route={"introduction"} />
      </div>
      <div className={styles.inner_container}>
     <div className={styles.column_one}></div>
     <div className={styles.column_two}></div>
     <div className={styles.column_three}></div>
      </div>
    </section>
  );
};

export default Playground;
