import Button from "@/components/Button";
import styles from "./styles.module.scss";
import Icon from "@/components/Icon";
import { useTranslations } from "next-intl";
import { useState, useEffect, useRef } from "react";
import { update } from "@/services/fetch";
import { useMessageToast } from "@/hooks/useMessageToast";
import { Oval } from "react-loader-spinner";
import { useBusinessContext } from "@/context/BusinessContext";
import CheckBox from "@/components/Checkbox";

const Palette = () => {
  const { formData, setFormData } = useBusinessContext();
  const [colors, setColors] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showIcon, setShowIcon] = useState<boolean>(false);
  const [checkbox, setCheckbox] = useState<boolean>(true);
  const [updateActive, setUpdateActive] = useState<boolean>(false);
  const { notify, notifyError } = useMessageToast();
  const dict = useTranslations("dict.business");

  const newColorInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (formData.client.palette && formData.client.palette.length > 0 && checkbox) {
      setColors(formData.client.palette.map(({ color }) => color));
    }
  }, [formData.client.palette]);

  const handleColorChange = (index: number, value: string) => {
    const updatedColors = [...colors];
    updatedColors[index] = value;
    setColors(updatedColors);
  };

  const handleRemoveColor = (index: number) => {
    const updatedColors = colors.filter((_, i) => i !== index);
    setColors(updatedColors);
    setUpdateActive(true);
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
        }, 10);
        setUpdateActive(true);
        return updatedColors;
      });
    }
  };

  const handleSaveColors = async () => {
    if (!updateActive) return;
    setLoading(true);
    const updatePalette = {
      palette: colors.map(color => ({ color })),
    };
    console.log(updatePalette, "up");
    const data = await update("small-business", updatePalette);

    if (data.statusCode === 200) {
      setLoading(false);
      setUpdateActive(false);
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

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (checkbox) setColors([]);
    setCheckbox(prevState => !prevState);
  };

  useEffect(() => {
    if (colors.length > 0) {
      setShowIcon(true);
    } else {
      setShowIcon(false);
    }
  }, [colors.length, updateActive]);
  /*   console.log("logo", logo, colors.length, formData.client.logo, "ASDASD"); */
  return (
    <div className={styles.colors}>
      <h6>{dict("data.colors")}</h6>
      <div className={styles.container}>
        <div className={styles.colors_container}>
          {colors.length > 0 &&
            colors.map((color, index) => (
              <div key={index} className={styles.column}>
                <div className={styles.additional_color_container}>
                  <input
                    type='color'
                    value={color}
                    onChange={e => handleColorChange(index, e.target.value)}
                    className={styles.color_input}
                    disabled={colors.length === 0}
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
            <div className={styles.add_btn_container}>
              <button className={styles.circle} onClick={handleAddColor}>
                <Icon name='add' viewBox='0 0 20 20' width={16} height={16} strokeWidth={1} />
              </button>
            </div>
          )}
        </div>
        <div className={styles.checkbox_container}>
          <CheckBox active={checkbox} onChange={handleCheckbox} />
          <p>{dict("data.ia")}</p>
        </div>
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
        /*    (logo && colors.length >= 1) || */
        formData.client.logo && (
          <p className={updateActive ? styles.update_active : styles.submit} onClick={handleSaveColors}>
            {dict("data.update_palette")}
          </p>
        )
      )}
      <p className={styles.description}>{dict("data.description")}</p>
    </div>
  );
};

export default Palette;
