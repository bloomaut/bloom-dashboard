import styles from "./styles.module.scss";
import Title from "@/components/Title";
import Link from "next/link";

interface Props {
  text: string;
  description: string;
  link?: string;
}

const LinkCard = ({ text, description, link }: Props) => {
  return (
    <>
      {link ? (
        <Link href={link} className={styles.container}>
          <Title text={text} />
          {description}
        </Link>
      ) : (
        <div className={styles.container}>
          <Title text={text} />
          {description}
        </div>
      )}
    </>
  );
};

export default LinkCard;
