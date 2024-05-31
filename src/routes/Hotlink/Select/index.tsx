import styles from "./styles.module.scss";
import Image from "next/image";
import { useFlakesContext } from "@/context/FlakesContext";
import { useTranslations } from "next-intl";
import { Fade } from "react-awesome-reveal";
import { useEffect, useState } from "react";
import { Powerapp } from "@/typescript/interfaces/flakes.interface";
// Components
import Loading from "@/app/[locale]/(playground)/introduction/loading";
import Icon from "@/components/Icon";

const Select = () => {
  const { flakes, loading, selectedFlakeId, setSelectedFlakeId } = useFlakesContext();
  const dict = useTranslations("dict.hotlinks");
  const [selectedFlake, setSelectedFlake] = useState<Powerapp | undefined>();

  useEffect(() => {
    if (flakes.length) {
      const findFlake: Powerapp | undefined = flakes.find(flake => flake._id === selectedFlakeId);
      setSelectedFlake(findFlake);
    }
  }, [flakes, selectedFlakeId]);

  const handleDesignChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFlakeId(e.target.value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.select}>
        <label>Diseño</label>
        {flakes?.length ? (
          <Fade triggerOnce>
            <select name='design' id='design' onChange={handleDesignChange} defaultValue={selectedFlakeId}>
              {flakes.map(flake => (
                <option key={flake._id} value={flake._id}>
                  {flake.skinx.title}
                </option>
              ))}
            </select>
          </Fade>
        ) : !loading ? (
          <p>{dict("empty_designs")}</p>
        ) : null}
      </div>
      <div className={styles.flakes}>
        {!loading ? (
          <div className={styles.template_container} key={selectedFlake?._id}>
            {selectedFlake && (
              <Fade triggerOnce>
                <div
                  className={`${styles.template} ${selectedFlakeId === selectedFlake._id ? styles.selected_template : ""}`}
                  onClick={() => setSelectedFlakeId(selectedFlake._id)}
                >
                  <div className={styles.sm_card}>
                    {selectedFlake.hog_related.thumbnail ? (
                      <Image
                        src={selectedFlake.hog_related.thumbnail}
                        alt={selectedFlake.skinx.title}
                        className={styles.image}
                        width={167}
                        height={120}
                      />
                    ) : (
                      <Icon
                        name='hog'
                        width={40}
                        height={40}
                        fillColor='#7f7f7f'
                        strokeColor='#7f7f7f'
                        strokeWidth={0.5}
                      />
                    )}
                  </div>
                  <div className={styles.lg_card}>
                    {selectedFlake.thumbnail ? (
                      <Image
                        src={selectedFlake.thumbnail}
                        alt={selectedFlake.skinx.title}
                        className={styles.image}
                        width={137}
                        height={100}
                      />
                    ) : (
                      <Icon
                        name='pwa'
                        width={80}
                        height={80}
                        fillColor='#7f7f7f'
                        strokeColor='#7f7f7f'
                        strokeWidth={0.1}
                        viewBox='0 0 109 127'
                      />
                    )}
                  </div>
                </div>
              </Fade>
            )}
          </div>
        ) : (
          <Loading />
        )}
      </div>
    </div>
  );
};

export default Select;
