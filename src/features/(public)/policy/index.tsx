import styles from "./styles/policies.module.scss";
import { useTranslations } from "next-intl";
import { last_update, policies } from "@/utils/policies";
import Image from "next/image";
import logo from "@/../public/assets/default_image.jpg";

const Policy = () => {
  const dict = useTranslations("dict.privacy");

  return (
    <div className={styles.container}>
      <Image src={logo} alt='Small' className={styles.logo} />
      <h2>{dict("title")}</h2>

      <h3 className={styles.subtitle}>{dict("subtitle")}</h3>
      <p className={styles.update}>
        {dict("update")} {last_update}
      </p>

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
  );
};

export default Policy;
