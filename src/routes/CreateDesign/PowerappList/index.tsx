import { useDesignContext } from "@/context/DesignContext";
import styles from "./styles.module.scss";
import { useEffect, useState } from "react";
import { get, post } from "@/services/fetch";
import { HogRelated } from "@/typescript/interfaces/flakes.interface";
import PowerappCard from "./PowerappCard";
import LoadingSpinner from "@/components/Loading";
import Button from "@/components/Button";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useMessageToast } from "@/hooks/useMessageToast";

interface PowerappListProps {
  setActiveStep: (n: number) => void;
}

const PowerappList = ({ setActiveStep }: PowerappListProps) => {
  const { listTemplates, setDesignSelected } = useDesignContext();
  const [powerApps, setPowerApps] = useState<HogRelated[]>();
  const [powerAppSelected, setPowerAppSelected] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [loadingNextPage, setLoadingNextPage] = useState(false);
  const dict = useTranslations("dict");
  const params = useParams();
  const { notifyError } = useMessageToast();

  useEffect(() => {
    const getPowerapps = async () => {
      const response = await get("design-small/powerapps");
      if (response.statusCode === 200) {
        setPowerApps(response.result.powerApps);
      } else {
        notifyError(dict("toast.bot_error"));
      }
      setLoading(false);
    };
    getPowerapps();
  }, []);

  const preparePowerapp = async () => {
    setLoadingNextPage(true);
    const dataToSend = {
      pwa_id: powerAppSelected,
      flake_id: String(params.id),
      type_design: listTemplates?.type.toLowerCase() || "",
    };
    const response = await post("design-small/prepare", dataToSend);
    if (response.data.statusCode === 201) {
      setActiveStep(2);
      setDesignSelected(response.data.result.design);
    } else {
      notifyError(dict("toast.error_template"));
    }
    setLoadingNextPage(false);
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <section className={styles.powerapp_list_container}>
          <h2 className={styles.title}>{dict("designs.diffusion.step_one_title")}</h2>
          <div className={styles.powerapp_list}>
            {powerApps ? (
              powerApps.map(powerApp => (
                <PowerappCard
                  key={powerApp._id}
                  powerApp={powerApp}
                  setPowerAppSelected={setPowerAppSelected}
                  powerAppSelected={powerAppSelected}
                />
              ))
            ) : (
              <p className={styles.empty_text}>{dict("designs.diffusion.empty_pwa")}</p>
            )}
          </div>
          <Button
            title={dict("designs.diffusion.btn_next")}
            onclick={preparePowerapp}
            isDisabled={!powerAppSelected.length}
            loading={loadingNextPage}
          />
        </section>
      )}
    </>
  );
};

export default PowerappList;
