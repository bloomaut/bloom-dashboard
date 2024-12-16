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
  const { listTemplates, setDesignSelected, selectedList, setSelectedList } = useDesignContext();
  const { notifyError } = useMessageToast();
  const [powerApps, setPowerApps] = useState<HogRelated[]>();
  const [powerAppSelected, setPowerAppSelected] = useState<string>("");
  const [flakeId, setFlakeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingNextPage, setLoadingNextPage] = useState(false);
  const dict = useTranslations("dict");
  const params = useParams();

  useEffect(() => {
    const storedSelectedList = "hog";
    if (storedSelectedList) {
      setSelectedList(storedSelectedList);
    }
  }, []);

  useEffect(() => {
    if (listTemplates?.designs) {
      const matchingDesign = listTemplates.designs.find(template => template._id === params.id);
      if (matchingDesign?.type_design === "hog") {
        setFlakeId(matchingDesign?.hog?._id);
      } else if (matchingDesign?.type_design === "post") {
        setFlakeId(matchingDesign?.post?._id);
      } else {
        setFlakeId(matchingDesign?.email?._id);
      }
    }
  }, [listTemplates, params.id, selectedList]);

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
      flake_id: flakeId || String(params.id),
      type_design: selectedList,
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
