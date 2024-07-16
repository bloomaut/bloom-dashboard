import styles from "./styles.module.scss";
import Icon from "@/components/Icon";
import { UserBusiness } from "@/typescript/interfaces/business.interface";
import { useTranslations } from "next-intl";

interface PaletteProps {
  palette: { color: string }[] | null;
  setFormData: React.Dispatch<React.SetStateAction<UserBusiness>>;
}

const Palette = ({ palette, setFormData }: PaletteProps) => {
  const dict = useTranslations("dict.business");

  return (
    <div className={styles.colors}>
      <h6>{dict("data.colors")}</h6>
      <div className={styles.container_circle}>
        {palette && palette.length > 0 ? (
          palette.map((color, index) => (
            <article key={index} className={styles.circle} style={{ backgroundColor: color.color }}></article>
          ))
        ) : (
          <>
            <article className={styles.circle}></article>
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

export default Palette;
