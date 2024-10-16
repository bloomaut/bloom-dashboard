import styles from "./styles.module.scss";
import Image from "next/image";
import Icon from "@/components/Icon";
import default_image from "/public/assets/default_image.jpg";
import Button from "@/components/Button";
import PopupConfirm from "@/components/PopupConfirm";
import PopupDesign from "@/routes/CreateDesign/PopupDesign";
import { useState } from "react";
import { HogRelated } from "@/typescript/interfaces/flakes.interface";
import { useTranslations } from "next-intl";
import { Link } from "@/navigation";
import { get, remove } from "@/services/fetch";
import { useMessageToast } from "@/hooks/useMessageToast";
import { useDesignContext } from "@/context/DesignContext";
import { DesignProps } from "@/typescript/interfaces/designs.interface";
import { createPortal } from "react-dom";

const TemplateCard = ({ title, thumbnail, _id, datatype, selectedList }: HogRelated) => {
  const [openPopup, setOpenPopup] = useState<boolean>(false);
  const [popupDelete, setPopupDelete] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [popupData, setPopupData] = useState<DesignProps | null>(null);
  const [activePopup, setActivePopup] = useState<boolean>(false);
  const { notify, notifyError } = useMessageToast();
  const { handleRemoveDesign } = useDesignContext();
  const dict = useTranslations("dict");

  const handleClick = () => {
    setOpenPopup(!openPopup);
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
      setOpenPopup(false);
      setLoading(false);
    }
  };

  const getDesignById = async (id: string) => {
    const response = await get(`design-small/${id}`);
    if (response?.statusCode === 200) {
      setPopupData(response.result.design);
      setActivePopup(true);
    }
  };

  const copyDesignLink = async (_id: string) => {
    // c = campaign
    await navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_ENGINE_URL}/c/${_id}`);
    notify("Design link copied on clipboard!");
  };

  const copyDiffusionLink = async (_id: string) => {
    await navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_ENGINE_URL}/d/${_id}`);
    notify("Diffusion link copied on clipboard!");
  };

  const copyLandingURL = async (_id: string) => {
    await navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_ENGINE_URL}/preview/landing/${_id}`);
    notify("Website link copied on clipboard!");
  };

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
              <button className={styles.actions} onClick={() => copyLandingURL(_id)}>
                <Icon name='copy' viewBox='0 0 60 60' strokeWidth={3} strokeColor='#282d7e' />
              </button>
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

        {/* {activePopup &&
            createPortal(
              <PopupDesign
                onCancel={() => setActivePopup(false)}
                setShowConfirmation={setActivePopup}
                thumbnail={popupData?.thumbnail || ""}
                title={popupData?.title || ""}
                description={popupData?.description || ""}
                typeDesign={popupData?.type_design || "hog"}
                hog={popupData?.hog?.title || ""}
                post={popupData?.post?.title || ""}
                email={popupData?.email?.title || ""}
                pwa={popupData?.power_app.title || ""}
                url={`${process.env.NEXT_PUBLIC_ENGINE_URL}/c/${popupData?._id}`}
                loading={loading}
                fields={popupData?.variables || []}
                id={popupData?._id}
                setPopupData={setPopupData}
              />,
              document.body,
            )
          }*/}
      </div>
    </div>
  );
};

export default TemplateCard;
