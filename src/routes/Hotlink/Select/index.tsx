import styles from "./styles.module.scss";
import { Powerapp } from "@/typescript/interfaces/flakes.interface";
import HogIcon from "@/routes/Playground/TemplatesSelector/Icons/Hog";
import Image from "next/image";
import Loading from "@/app/[locale]/(playground)/introduction/loading";
import { useFlakesContext } from "@/context/FlakesContext";
import { useState } from "react";

const Select = () => {
  const { flakes, loading, selectedFlakeId, setSelectedFlakeId } = useFlakesContext();
  const [selectedDesign, setSelectedDesign] = useState("SkinX");
  const [selectedTemplate, setSelectedTemplate] = useState("FlakeX");

  const handleDesignChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDesign(event.target.value);
    const selectedFlake = flakes.find(flake => flake.skinx.title === event.target.value);
    if (selectedFlake) {
      setSelectedFlakeId(selectedFlake._id);
    }
  };

  const filteredFlakes = flakes.filter(flake => flake.skinx.title === selectedDesign);
  {
    /* 

  const handleTemplateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTemplate(event.target.value);
    const selectedFlake = flakes.find(
      flake => flake.skinx.title === selectedDesign && flake.template === event.target.value,
    );
    if (selectedFlake) {
      setSelectedFlakeId(selectedFlake._id);
    }
  };
  */
  }
  return (
    <div className={styles.container}>
      <div className={styles.select}>
        <div className={styles.column}>
          <label>Diseño</label>
          <select name='design' id='design' value={selectedDesign} onChange={handleDesignChange}>
            {flakes.map(flake => (
              <option key={flake._id} value={flake.skinx.title}>
                {flake.skinx.title}
              </option>
            ))}
          </select>
        </div>
        {/*
        <div className={styles.column}>
          <label>Plantilla</label>
          <select name='template' id='template' value={selectedTemplate} onChange={handleTemplateChange}>
            {flakes.map(flake => (
              <option key={flake._id} value={flake.template}>
                {flake.template}
              </option>
            ))}
          </select>
        </div>
         */}
      </div>
      <div className={styles.flakes}>
        {!loading ? (
          selectedDesign ? (
            filteredFlakes?.map((app: Powerapp) => (
              <div className={styles.template_container} key={app._id}>
                <h4 className={styles.title}>{app.skinx.title}</h4>
                <div
                  className={`${styles.template} ${selectedFlakeId === app._id ? styles.selected_template : ""}`}
                  onClick={() => setSelectedFlakeId(app._id)}
                >
                  <div className={styles.sm_card}>
                    {app.hog_related.thumbnail ? (
                      <Image src={app.hog_related.thumbnail} alt={app.skinx.title} width={167} height={120} />
                    ) : (
                      <HogIcon />
                    )}
                  </div>
                  <div className={styles.lg_card}>
                    {app.thumbnail && <Image src={app.thumbnail} alt={app.skinx.title} width={137} height={100} />}
                  </div>
                </div>
              </div>
            ))
          ) : (
            // Mostrar un contenedor vacío si no hay ningún diseño seleccionado
            <div className={styles.template_container}>
              <h4 className={styles.title}>No hay diseño seleccionado</h4>
              <div className={`${styles.template}`}>
                <div className={styles.sm_card}>
                  <HogIcon />
                </div>
                <div className={styles.lg_card}></div>
              </div>
            </div>
          )
        ) : (
          <div className={styles.loader}>
            <Loading />
          </div>
        )}
      </div>
    </div>
  );
};

export default Select;
