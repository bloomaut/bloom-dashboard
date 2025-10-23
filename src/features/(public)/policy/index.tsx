import styles from "./styles/policies.module.scss";
import { useTranslations } from "next-intl";
import { last_update, policies } from "@/utils/policies";
import Image from "next/image";
import bloomLogo from "@/../public/bloomLogo.png";

const Policy = () => {
  const dict = useTranslations("dict.privacy");

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.header_section}>
        <Image src={bloomLogo} alt='Bloom' className={styles.logo} />
        <h1 className={styles.main_title}>{dict("title")}</h1>
        <h2 className={styles.subtitle}>{dict("subtitle")}</h2>
        <p className={styles.update}>
          {dict("update")} {last_update}
        </p>
      </div>

      {/* Content Section */}
      <div className={styles.content_section}>
        <ol className={styles.list_container}>
          {policies.map((policy, index) => (
            <li className={styles.item} key={policy.id}>
              <div className={styles.content}>
                <h3 className={styles.item_title}>{dict(`title_0${index + 1}`)}</h3>
                <p className={styles.item_description}>{dict(`description_0${index + 1}`)}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default Policy;
