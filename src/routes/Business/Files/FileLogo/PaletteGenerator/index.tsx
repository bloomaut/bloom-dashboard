import styles from "./styles.module.scss";
import Icon from "@/components/Icon";
import { useState } from "react";
import { colorPalleteGenerator } from "@/utils/colorPalleteGenerator";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updatePallete } from "@/store/features/businessSlice";
import { update } from "@/services/fetch";
import { PaletteItem } from "@/typescript/interfaces/business.interface";
import { useMessageToast } from "@/hooks/useMessageToast";
import { useTranslations } from "next-intl";

const PaletteGenerator = () => {
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
      const response = await update("small-business", dataToSend);
      if (response.statusCode === 200) {
        dispatch(updatePallete(palettePreview));
        setPalettePreview([]);
        setEdit(false);
        notify(`${dict("toast.success_palette")}`);
      }
    } catch (error) {
      notifyError(`${dict("toast.error_palette")}`);
    }
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setEdit(false);
    if (palettePreview) setPalettePreview([]);
  };

  const handleEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setEdit(true);
  };

  return (
    <form className={styles.container} onSubmit={handleSubmitPallete}>
      <div className={styles.header}>
        {(palette.length || palettePreview.length) && !edit ? (
          <p>Paleta de Colores</p>
        ) : (
          <>
            <p>Seleccione el color base 👉</p>
            <input className={styles.color_base} type='color' value={colorBase} onChange={selectedColor} />
          </>
        )}
      </div>
      <div className={styles.content}>
        <div className={styles.inner_content}>
          {palette.length && palettePreview.length === 0 && !edit ? (
            <>
              <div className={styles.box_container}>
                {palette.map((colorObj, index) => (
                  <div
                    key={index}
                    className={styles.box}
                    style={{
                      backgroundColor: colorObj.color,
                    }}
                  ></div>
                ))}
              </div>
              <button className={styles.btn_edit} onClick={handleEdit}>
                <Icon name='edit' width={25} height={25} strokeColor='#7f7f7f' viewBox='0 0 25 18' />
              </button>
            </>
          ) : (
            <>
              <div className={styles.box_container}>
                {palettePreview.map((colorObj, index) => (
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
                <button className={styles.btn} onClick={handleCancel}>
                  Cancelar
                </button>
                <button className={styles.btn} onClick={handleSetPallete}>
                  Generar
                </button>
                {palettePreview.length > 0 && (
                  <button className={styles.btn_submit} type='submit'>
                    Guardar
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </form>
  );
};

export default PaletteGenerator;
