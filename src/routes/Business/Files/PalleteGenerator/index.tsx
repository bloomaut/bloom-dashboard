import { useState } from "react";
import { colorPalleteGenerator } from "@/utils/colorPalleteGenerator";
import { useAppDispatch } from "@/store/hooks";
import { updatePallete } from "@/store/features/businessSlice";
import styles from "./styles.module.scss";

const PalleteGenerator = () => {
  const [colorBase, setColorBase] = useState("#FFFFFF");
  const [palette, setPalette] = useState<string[]>([]);
  const dispatch = useAppDispatch();

  const selectedColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedColorValue = e.target.value;
    setColorBase(selectedColorValue);
  };

  const handleSetPallete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const newPallete = colorPalleteGenerator(colorBase);
    setPalette(newPallete);
    // dispatch(updatePallete(newPallete));
  };

  const handleSubmitPallete = (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(palette);
  };

  return (
    <form className={styles.container} onSubmit={handleSubmitPallete}>
      <div className={styles.header}>
        <p>Seleccione el color base 👉</p>
        <input className={styles.color_base} type='color' value={colorBase} onChange={selectedColor} />
      </div>
      <div className={styles.box_container}>
        {palette.map((color, index) => (
          <div
            key={index}
            className={styles.box}
            style={{
              backgroundColor: color,
            }}
          />
        ))}
      </div>
      <div className={styles.btn_container}>
        <button className={styles.btn_generate} onClick={handleSetPallete}>
          Generar
        </button>
        {palette.length > 0 && (
          <button className={styles.btn_submit} type='submit'>
            Enviar
          </button>
        )}
      </div>
    </form>
  );
};

export default PalleteGenerator;
