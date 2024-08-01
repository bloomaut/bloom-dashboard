import Button from "@/components/Button";
import styles from "./styles.module.scss";
import Icon from "@/components/Icon";
import { UserBusiness } from "@/typescript/interfaces/business.interface";
import { useTranslations } from "next-intl";
import { useState, useEffect, useRef } from "react";
import { update } from "@/services/fetch";
import { useMessageToast } from "@/hooks/useMessageToast";
import { Oval } from "react-loader-spinner";

interface PaletteProps {
  palette: { color: string }[] | null;
  setFormData: React.Dispatch<React.SetStateAction<UserBusiness>>;
  logo: File | null;
}

const Palette = ({ palette, setFormData, logo }: PaletteProps) => {
  const [colors, setColors] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showIcon, setShowIcon] = useState<boolean>(false);
  const { notify, notifyError } = useMessageToast();
  const dict = useTranslations("dict.business");

  const newColorInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (palette && palette.length > 0) {
      setColors(palette.map(({ color }) => color));
    } else {
      setColors(["#ffffff"]);
    }
  }, [palette]);

  const handleColorChange = (index: number, value: string) => {
    const updatedColors = [...colors];
    updatedColors[index] = value;
    setColors(updatedColors);
  };

  const handleRemoveColor = (index: number) => {
    const updatedColors = colors.filter((_, i) => i !== index);
    if (updatedColors.length < 1) return;
    setColors(updatedColors);
  };

  const handleAddColor = () => {
    setShowIcon(true);
    if (colors.length < 5) {
      setColors(prevColors => {
        const updatedColors = [...prevColors, "#ffffff"];
        setTimeout(() => {
          if (newColorInputRef.current) {
            newColorInputRef.current.click();
          }
        }, 0);
        return updatedColors;
      });
    }
  };

  const handleSaveColors = async () => {
    setLoading(true);
    const updatePalette = {
      palette: colors.map(color => ({ color })),
    };

    const data = await update("small-business", updatePalette);

    if (data.statusCode === 200) {
      setLoading(false);
      notify("Paleta actualizada correctamente");
      setFormData(prevFormData => ({
        ...prevFormData,
        client: {
          ...prevFormData.client,
          palette: updatePalette.palette,
        },
      }));
    } else {
      setLoading(false);
      notifyError("Error al actualizar la paleta");
    }
  };

  useEffect(() => {
    if (colors.length > 1) {
      setShowIcon(true);
    } else {
      setShowIcon(false);
    }
  }, [colors.length]);

  return (
    <div className={styles.colors}>
      <h6>{dict("data.colors")}</h6>
      <div className={styles.container}>
        {colors.map((color, index) => (
          <div key={index} className={styles.column}>
            <div className={styles.additional_color_container}>
              <input
                type='color'
                value={color}
                onChange={e => handleColorChange(index, e.target.value)}
                className={styles.color_input}
                disabled={colors.length === 1}
                ref={index === colors.length - 1 ? newColorInputRef : null}
              />
            </div>
            {showIcon && (
              <Button
                title={""}
                icon={<Icon name='delete' width={20} height={20} strokeColor='#7f7f7f' viewBox='0 0 23 26' />}
                styleName='btn_delete_business'
                onclick={() => handleRemoveColor(index)}
              />
            )}
          </div>
        ))}
        {colors.length < 5 && (
          <button className={styles.circle} onClick={handleAddColor}>
            <Icon name='add' viewBox='0 0 20 20' width={16} height={16} strokeWidth={1} />
          </button>
        )}
      </div>
      {loading ? (
        <div className={styles.loading_container}>
          <Oval
            height={25}
            width={25}
            color='#ff5722'
            wrapperStyle={{}}
            wrapperClass=''
            visible={true}
            ariaLabel='oval-loading'
            secondaryColor='#fff'
            strokeWidth={3.5}
            strokeWidthSecondary={3.5}
          />
        </div>
      ) : (
        logo &&
        colors.length >= 1 && (
          <p className={styles.submit} onClick={handleSaveColors}>
            Update palette
          </p>
        )
      )}
      <p className={styles.description}>{dict("data.description")}</p>
    </div>
  );
};

export default Palette;
