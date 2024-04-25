import styles from "./styles.module.scss";
import Image from "next/image";
import HogIcon from "@/routes/Playground/TemplatesSelector/Icons/Hog";
import PwaIcon from "./Icon/Pwa";
import { useState } from "react";
import { useFlakesContext } from "@/context/FlakesContext";
// Components
import Loading from "@/app/[locale]/(playground)/introduction/loading";
import { useTranslations } from "next-intl";

const Select = () => {
  const { flakes, loading, selectedFlakeId, setSelectedFlakeId } = useFlakesContext();
  const [selectedDesign, setSelectedDesign] = useState(flakes[0]?.skinx._id);
  const dict = useTranslations("dict.hotlinks");
  const selectedFlake = flakes.find(flake => flake._id === selectedFlakeId);

  const handleDesignChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDesign(event.target.value);
    const selectedFlake = flakes.find(flake => flake._id === event.target.value);
    if (selectedFlake) {
      setSelectedFlakeId(selectedFlake._id);
    }
  };

  console.log(flakes);

  return (
    <div className={styles.container}>
      <div className={styles.select}>
        <label>Diseño</label>
        {flakes?.length ? (
          <select name='design' id='design' onChange={handleDesignChange} defaultValue={selectedFlakeId}>
            {flakes.map(flake => (
              <option key={flake._id} value={flake._id}>
                {flake.skinx.title}
              </option>
            ))}
          </select>
        ) : (
          <p>{dict("empty_designs")}</p>
        )}
      </div>
      <div className={styles.flakes}>
        {!loading ? (
          <div className={styles.template_container} key={selectedFlake?._id}>
            {selectedFlake && (
              <>
                <div
                  className={`${styles.template} ${selectedFlakeId === selectedFlake._id ? styles.selected_template : ""}`}
                  onClick={() => setSelectedFlakeId(selectedFlake._id)}
                >
                  <div className={styles.sm_card}>
                    {selectedFlake.hog_related.thumbnail ? (
                      <Image
                        src={selectedFlake.hog_related.thumbnail}
                        alt={selectedFlake.skinx.title}
                        width={167}
                        height={120}
                      />
                    ) : (
                      <HogIcon />
                    )}
                  </div>
                  <div className={styles.lg_card}>
                    {selectedFlake.thumbnail ? (
                      <Image src={selectedFlake.thumbnail} alt={selectedFlake.skinx.title} width={137} height={100} />
                    ) : (
                      <PwaIcon />
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
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
