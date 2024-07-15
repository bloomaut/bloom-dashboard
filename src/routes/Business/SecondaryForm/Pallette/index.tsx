import styles from "./styles.module.scss";
import Icon from "@/components/Icon";
import { useAppSelector } from "@/store/hooks";
import { useTranslations } from "next-intl";

const Pallette = () => {
  const dict = useTranslations("dict.business");
  const userData = useAppSelector(state => state.userData);

  return (
    <div className={styles.colors}>
      <h6>{dict("data.colors")}</h6>
      <div className={styles.container_circle}>
        {userData?.client.palette ? (
          // No se que dato es ni cual vendrá en pallete
          userData?.client.palette.map((color: any) => <option key={userData.id}>{color}</option>)
        ) : (
          <>
            <article className={styles.circle}></article>
            <article className={styles.circle}></article>
          </>
        )}
        <article className={styles.circle}>
          <Icon name='add' viewBox='0 0 20 22' width={35} height={35} strokeWidth={1} />
        </article>
      </div>
      <p className={styles.description}>{dict("data.description")}</p>
    </div>
  );
};

export default Pallette;
