import styles from "./styles.module.scss";
import HogIcon from "@/routes/Playground/TemplatesSelector/Icons/Hog";
import Image from "next/image";
import Loading from "@/app/[locale]/(playground)/introduction/loading";
import { useFlakesContext } from "@/context/FlakesContext";
import { useTranslations } from "next-intl";

const Select = () => {
  const { flakes, loading, selectedFlakeId, setSelectedFlakeId } = useFlakesContext();
  const selectedFlake = flakes.find(flake => flake._id === selectedFlakeId);
  const dict = useTranslations("dict.hotlinks");

  const handleDesignChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedFlake = flakes.find(flake => flake.skinx.title === event.target.value);
    if (selectedFlake) {
      setSelectedFlakeId(selectedFlake._id);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.select}>
        <label>{dict("select")}</label>
        <select name='design' id='design' onChange={handleDesignChange}>
          {flakes.map((flake, index) => (
            <option key={index} value={flake.skinx.title} selected={index === 0}>
              {flake.skinx.title}
            </option>
          ))}
        </select>
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
                    {selectedFlake.thumbnail && (
                      <Image src={selectedFlake.thumbnail} alt={selectedFlake.skinx.title} width={137} height={100} />
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
