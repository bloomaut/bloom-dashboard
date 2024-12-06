import styles from "./styles.module.scss";
import Image from "next/image";
import Icon from "@/components/Icon";
import default_image from "/public/assets/default_image.jpg";
import PopupConfirm from "@/components/PopupConfirm";
import PopupDesign from "@/routes/CreateDesign/PopupDesign";
import PopupSubdomains from "@/routes/CreateDesign/PopupSubdomains";
import { useEffect, useState } from "react";
import { HogRelated } from "@/typescript/interfaces/flakes.interface";
import { useTranslations } from "next-intl";
import { Link } from "@/navigation";
import { get, remove } from "@/services/fetch";
import { useMessageToast } from "@/hooks/useMessageToast";
import { useDesignContext } from "@/context/DesignContext";
import { createPortal } from "react-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setDataSubdomains } from "@/store/features/subdomainsSlice";

const TemplateCard = ({ title, thumbnail, _id, datatype, selectedList }: HogRelated) => {
  const [popupDelete, setPopupDelete] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [showLandingPopup, setShowLandingPopup] = useState<boolean>(false);
  const [hasSubdomainAssigned, setHasSubdomainAssigned] = useState<boolean>(false);
  const subdomainsData = useAppSelector(state => state.subdomainsData);
  const { notify, notifyError } = useMessageToast();
  const { handleRemoveDesign } = useDesignContext();
  const dispatch = useAppDispatch();
  const dict = useTranslations("dict");

  /* DESIGNS FUNCTIONS */

  const copyDesignLink = async (_id: string) => {
    // c = campaign
    await navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_ENGINE_URL}/c/${_id}`);
    notify("Design link copied on clipboard!");
  };

  const handleDelete = async () => {
    setLoading(true);
    if (_id) {
      const data = await remove("design-small", _id);
      if (data.statusCode === 200) {
        notify(dict("toast.success_delete"));
        handleRemoveDesign(_id);
      } else {
        notifyError(dict("toast.error_design_delete"));
      }
      setPopupDelete(false);
      setLoading(false);
    }
  };

  const getDesignById = async (id: string) => {
    // Esta función se usaba cuando usábamos el PopupDesign para mostrar el diseño
    const response = await get(`design-small/${id}`);
    if (response?.statusCode === 200) {
      setShowLandingPopup(true);
    }
  };

  /* HOGS FUNCTIONS */

  const copyDiffusionLink = async (_id: string) => {
    await navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_ENGINE_URL}/d/${_id}`);
    notify("Diffusion link copied on clipboard!");
  };

  /* LANDINGS FUNCTIONS */

  useEffect(() => {
    landingHasDomainAssigned();
  }, [hasSubdomainAssigned, subdomainsData]);

  const landingHasDomainAssigned = () => {
    let hasSubdomainAssigned = false;
    subdomainsData.subdomains.map(s => {
      if (s.flake_landing?._id === _id) {
        hasSubdomainAssigned = true;
      }
    });
    setHasSubdomainAssigned(hasSubdomainAssigned);
  };

  const copyLandingURL = async (_id: string) => {
    // await navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_ENGINE_URL}/preview/landing/${_id}`);
    subdomainsData.subdomains.map(async s => {
      if (s.flake_landing?._id === _id) {
        await navigator.clipboard.writeText(`https://${s.full_domain}`);
      }
    });
    notify("Website link copied on clipboard!");
  };

  const handleConfirm = (landingEngineId: number) => {
    const subdomains = subdomainsData.subdomains.map(s => {
      if (s.id === landingEngineId) {
        return {
          id: s.id,
          base_url: s.base_url,
          subdomain: s.subdomain,
          full_domain: s.full_domain,
          registration: s.registration,
          created_at: s.created_at,
          updated_at: s.updated_at,
          flake_landing: { _id },
        };
      } else {
        return s;
      }
    });
    dispatch(setDataSubdomains(subdomains));
  };

  /* POST FUNCTIONS */

  const downloadPostImage = async (thumbnail: string | null) => {
    if (!thumbnail) {
      notifyError("No image available to download.");
      return false;
    }
    const link = document.createElement("a");
    link.href = thumbnail;
    link.download = `${title}.jpg`;
    link.target = "_blank";
    link.click();
  };

  return (
    <div className={`${styles.design_card} ${datatype === "flakes" ? styles.design_create : ""}`}>
      <div className={styles.head}>
        <div className={styles.title_wrap}>
          <p className={styles.title}>{title}</p>
        </div>
        <Image src={thumbnail || default_image} fill sizes='500px' priority alt='Design thumbnail' />

        <div className={styles.card_action}>
          <div className={styles.card_icons}>
            {selectedList === "landing" && (
              <>
                {hasSubdomainAssigned ? (
                  <>
                    <button className={styles.actions} onClick={() => copyLandingURL(_id)}>
                      <Icon name='copy' viewBox='0 0 60 60' strokeWidth={3} strokeColor='#282d7e' />
                    </button>
                    <button className={styles.bottom_actions} onClick={() => setShowLandingPopup(true)}>
                      <Icon name='config' viewBox='0 0 85 85' strokeWidth={5} strokeColor='#282d7e' />
                    </button>
                  </>
                ) : (
                  <button className={styles.actions} onClick={() => setShowLandingPopup(true)}>
                    <Icon name='config' viewBox='0 0 85 85' strokeWidth={4} strokeColor='#282d7e' />
                  </button>
                )}
                {showLandingPopup &&
                  createPortal(
                    <PopupSubdomains
                      onConfirm={handleConfirm}
                      onCancel={() => setShowLandingPopup(false)}
                      setShowConfirmation={setShowLandingPopup}
                      landingId={_id}
                      title={title}
                    />,
                    document.body,
                  )}
              </>
            )}

            {datatype === "designs" && selectedList === "hog" && (
              <>
                <button className={styles.actions} onClick={() => copyDesignLink(_id)}>
                  <Icon name='copy' viewBox='0 0 60 60' strokeWidth={3} strokeColor='#282d7e' />
                </button>
                <button className={styles.bottom_actions} onClick={() => setPopupDelete(true)}>
                  <Icon name='delete' viewBox='0 0 25 25' strokeWidth={2} strokeColor='#282d7e' />
                </button>
                <Link className={`${styles.bottom_actions} ${styles.edit_action}`} href={`/designs/update/${_id}`}>
                  <Icon name='design_2' viewBox='0 0 23 23' strokeWidth={1.5} strokeColor='#282d7e' />
                </Link>
              </>
            )}
            {datatype === "diffusion" && selectedList === "hog" && (
              <button className={styles.actions} onClick={() => copyDiffusionLink(_id)}>
                <Icon name='copy' viewBox='0 0 60 60' strokeWidth={3} strokeColor='#282d7e' />
              </button>
            )}

            {datatype === "designs" && selectedList === "post" && (
              <>
                <button className={styles.actions} onClick={() => downloadPostImage(thumbnail || null)}>
                  <Icon name='arrow_download' viewBox='0 0 25 25' strokeWidth={1.5} strokeColor='#282d7e' />
                </button>
                <button className={styles.bottom_actions} onClick={() => setPopupDelete(true)}>
                  <Icon name='delete' viewBox='0 0 25 25' strokeWidth={2} strokeColor='#282d7e' />
                </button>
                <Link className={`${styles.bottom_actions} ${styles.edit_action}`} href={`/designs/update/${_id}`}>
                  <Icon name='design_2' viewBox='0 0 23 23' strokeWidth={1.5} strokeColor='#282d7e' />
                </Link>
              </>
            )}
            {datatype === "genericPost" && selectedList === "post" && (
              <button className={styles.actions} onClick={() => downloadPostImage(thumbnail || null)}>
                <Icon name='arrow_download' viewBox='0 0 25 25' strokeWidth={1.5} strokeColor='#282d7e' />
              </button>
            )}

            {datatype === "flakes" && (
              <Link className={styles.create_link} href={`/designs/create/${_id}`}>
                <Icon name='design_2' viewBox='0 0 22 22' strokeWidth={1.5} strokeColor='#282d7e' />
              </Link>
            )}
          </div>
        </div>

        {popupDelete &&
          createPortal(
            <PopupConfirm
              onConfirm={handleDelete}
              onCancel={() => setPopupDelete(false)}
              setShowConfirmation={setPopupDelete}
              title={dict("popup.delete_design")}
              loading={loading}
              textCancel={dict("popup.cancel")}
              textAccept={dict("popup.confirm")}
            />,
            document.body,
          )}
      </div>
    </div>
  );
};

export default TemplateCard;
function dispatch(arg0: { payload: any; type: "subdomainsData/setDataSubdomains" }) {
  throw new Error("Function not implemented.");
}
