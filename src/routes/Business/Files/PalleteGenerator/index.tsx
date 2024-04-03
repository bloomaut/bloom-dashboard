import { useState } from "react";
import { colorPalleteGenerator } from "@/utils/colorPalleteGenerator";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updatePallete } from "@/store/features/businessSlice";
import { ENV } from "@/typescript/types/environment.enum";
import { update } from "@/services/fetch";
import styles from "./styles.module.scss";
import { PaletteItem } from "@/typescript/interfaces/business.interface";
import { useMessageToast } from "@/hooks/useMessageToast";
import { useTranslations } from "next-intl";
import Image from "next/image";
import pencilIcon from "/public/icons/edit.svg";

const PalleteGenerator = () => {
  const [colorBase, setColorBase] = useState("#FFFFFF");
  const [palettePreview, setPalettePreview] = useState<PaletteItem[]>([]);
  const palette = useAppSelector(state => state.business.palette);
  const [edit, setEdit] = useState(false);
  const { notify, notifyError } = useMessageToast();
  const dispatch = useAppDispatch();
  const dict = useTranslations("dict");

  const selectedColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedColorValue = e.target.value;
    setColorBase(selectedColorValue);
  };

  const handleSetPallete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const newPallete = colorPalleteGenerator(colorBase);
    setPalettePreview(newPallete);
  };

  const handleSubmitPallete = async (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const dataToSend = {
        palette: palettePreview,
      };
      const response = await update("small-business", ENV.DASH, dataToSend);
      if (response.statusCode === 200) {
        dispatch(updatePallete(palettePreview));
        setPalettePreview([]);
        setEdit(false);
        notify(`${dict("toast.success_palette")}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setEdit(true);
  };

  return (
    <form className={styles.container} onSubmit={handleSubmitPallete}>
      <div className={styles.header}>
        <p>{palette && !edit ? "Paleta de colores" : "Seleccione el color base 👉"}</p>
        {(!palette || edit) && (
          <input className={styles.color_base} type='color' value={colorBase} onChange={selectedColor} />
        )}
      </div>
      {palette.length >= 1 ? (
        <div className={styles.content}>
          <div className={styles.box_container}>
            {edit ? (
              <div className={styles.inner_container}>
                <div className={styles.edit_container}>
                  {palettePreview.length > 0
                    ? palettePreview.map((colorObj, index) => (
                        <div
                          key={index}
                          className={styles.box}
                          style={{
                            backgroundColor: colorObj.color,
                          }}
                        ></div>
                      ))
                    : palette.map((colorObj, index) => (
                        <div
                          key={index}
                          className={styles.box}
                          style={{
                            backgroundColor: colorObj.color,
                          }}
                        ></div>
                      ))}
                </div>
                <div className={styles.btn_container}>
                  <button className={styles.btn} onClick={handleSetPallete}>
                    Generar
                  </button>
                  {palettePreview.length > 0 && (
                    <button className={styles.btn_submit} type='submit'>
                      Enviar
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <>
                {palette.map((colorObj, index) => (
                  <div
                    key={index}
                    className={styles.box}
                    style={{
                      backgroundColor: colorObj.color,
                    }}
                  ></div>
                ))}
                <button className={styles.btn_edit} onClick={handleEdit}>
                  <Image className={styles.controls_icons} src={pencilIcon} alt='pencil-icon' />
                </button>
              </>
            )}
          </div>
        </div>
      ) : (
        ""
      )}
    </form>
  );
};

export default PalleteGenerator;
