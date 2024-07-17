import styles from "./styles.module.scss";
import Icon from "@/components/Icon";
import { UserBusiness } from "@/typescript/interfaces/business.interface";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface PaletteProps {
  palette: { color: string }[] | null;
  setFormData: React.Dispatch<React.SetStateAction<UserBusiness>>;
}

const Palette = ({ palette, setFormData }: PaletteProps) => {
  const [additionalColors, setAdditionalColors] = useState<string[]>([]);
  const dict = useTranslations("dict.business");

  const handleAddColors = () => {
    if (additionalColors.length < 2) {
      setAdditionalColors([...additionalColors, ""]);
    }
  };

  const handleColorChange = (index: number, value: string) => {
    const updatedColors = [...additionalColors];
    updatedColors[index] = value;
    setAdditionalColors(updatedColors);
  };

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
        {additionalColors.map((color, index) => (
          <div key={index} className={styles.additional_color_container}>
            <input
              type='color'
              value={color}
              onChange={e => handleColorChange(index, e.target.value)}
              className={styles.color_input}
            />
          </div>
        ))}
        {additionalColors.length < 2 && (
          <button className={styles.circle} onClick={handleAddColors}>
            <Icon name='add' viewBox='0 0 20 20' width={16} height={16} strokeWidth={1} />
          </button>
        )}
      </div>
      <p className={styles.description}>{dict("data.description")}</p>
    </div>
  );
};

export default Palette;
