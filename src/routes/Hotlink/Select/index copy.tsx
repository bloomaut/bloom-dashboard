import styles from "./styles.module.scss";
import HogIcon from "@/routes/Playground/TemplatesSelector/Icons/Hog";
import Image from "next/image";
import Loading from "@/components/Loading";
import { useFlakeData } from "@/hooks/useFlakesUser";
import { useState } from "react";

const Select = () => {
  const { flakes, loading } = useFlakeData();
  const [selectedFlakeId, setSelectedFlakeId] = useState<string>("");

  const handleDesignChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedFlake = flakes.find(flake => flake.skinx.title === event.target.value);
    if (selectedFlake) {
      setSelectedFlakeId(selectedFlake._id);
    }
  };

  if (loading) {
    return <Loading />;
  }

  const selectedFlake = flakes.find(flake => flake._id === selectedFlakeId);

  return (
    <div className={styles.container}>
      <div className={styles.select}>
        <label>Diseño</label>
        <select name='design' id='design' onChange={handleDesignChange}>
          {flakes.map((flake, index) => (
            <option key={index} value={flake.skinx.title}>
              {flake.skinx.title}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.flakes}>
        <div className={styles.template_container}>
          {selectedFlake && (
            <div className={`${styles.template} ${styles.selected_template}`}>
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Select;
