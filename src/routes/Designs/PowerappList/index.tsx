import { useDesignContext } from "@/context/DesignContext";
import styles from "./styles.module.scss";
import { useEffect, useState } from "react";
import { get, post } from "@/services/fetch";
import { HogRelated } from "@/typescript/interfaces/flakes.interface";
import PowerappCard from "./PowerappCard";
import LoadingSpinner from "@/components/Loading";
import Button from "@/components/Button";

const PowerappList = () => {
  const { listTemplates } = useDesignContext();
  const [powerApps, setPowerApps] = useState<HogRelated[]>();
  const [powerAppSelected, setPowerAppSelected] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPowerapps = async () => {
      const response = await get("designs/powerapps");
      if (response.statusCode === 200) {
        setPowerApps(response.result.powerApps);
      }
      setLoading(false);
    };
    getPowerapps();
  }, []);

  const preparePowerapp = async () => {
    const dataToSend = {
      pwa_id: powerAppSelected,
      flake_id: "string",
      type_design: listTemplates?.type || "",
    };
    const response = await post("designs/prepare", dataToSend);
    if (response.statusCode === 200) {
      console.log(response.result);
    }
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <section className={styles.powerapp_list_container}>
          <h2 className={styles.title}>Select the Power App to Diffuse</h2>
          <div className={styles.powerapp_list}>
            {powerApps?.map(powerApp => (
              <PowerappCard
                key={powerApp._id}
                powerApp={powerApp}
                setPowerAppSelected={setPowerAppSelected}
                powerAppSelected={powerAppSelected}
              />
            ))}
          </div>
          <Button title='Next Step' onclick={preparePowerapp} isDisabled={!powerAppSelected.length} />
        </section>
      )}
    </>
  );
};

export default PowerappList;
