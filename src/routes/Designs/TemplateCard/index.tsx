import styles from "./styles.module.scss";
import Image from "next/image";
import Icon from "@/components/Icon";
import default_image from "/public/assets/default_image.jpg";
import { useState } from "react";
import { HogRelated } from "@/typescript/interfaces/flakes.interface";
import { useTranslations } from "next-intl";
import { Link } from "@/navigation";
import PopupConfirm from "@/components/PopupConfirm";
import { get, remove } from "@/services/fetch";
import { useMessageToast } from "@/hooks/useMessageToast";
import { createPortal } from "react-dom";
import { useDesignContext } from "@/context/DesignContext";
import PopupDesign from "@/routes/CreateDesign/PopupDesign";
import { DesignProps } from "@/typescript/interfaces/designs.interface";

const TemplateCard = ({ title, thumbnail, _id, datatype }: HogRelated) => {
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

  return (
    <div className={styles.hog}>
      <div className={styles.head}>
        <p className={styles.title}>{title}</p>
        <div className={styles.option} onClick={handleClick}>
          <Icon name='ellipsis' width={20} height={20} viewBox='0 3 30 30' />
          {openPopup && (
            <div className={styles.popup}>
              {datatype === "designs" ? (
                <>
                  <button className={styles.btn_container} onClick={() => getDesignById(_id)}>
                    {dict("designs.diffusion.view_design")}
                    <Icon name='eye' viewBox='0 0 25 20' strokeColor='#7f7f7f' />
                  </button>
                  <p className={styles.create}>
                    <Link href={`/designs/update/${_id}`}>
                      <Icon name='design_2' viewBox='0 0 25 20' strokeColor='#7f7f7f' />
                      {dict("designs.diffusion.edit_design")}
                    </Link>
                  </p>
                  <p className={styles.create}>
                    <button onClick={() => setPopupDelete(true)}>
                      <Icon name='delete' viewBox='0 0 25 20' strokeColor='#7f7f7f' />
                      {dict("designs.diffusion.delete_design")}
                    </button>
                  </p>
                </>
              ) : (
                <p className={styles.create}>
                  <Link href={`/designs/create/${_id}`}>
                    <Icon name='design_2' viewBox='0 0 25 20' strokeColor='#7f7f7f' />
                    {dict("designs.diffusion.create_design")}
                  </Link>
                </p>
              )}
            </div>
          )}
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
          {activePopup &&
            createPortal(
              <PopupDesign
                onCancel={() => setActivePopup(false)}
                setShowConfirmation={setActivePopup}
                thumbnail={popupData?.hog.thumbnail || ""}
                title={popupData?.title || ""}
                description={popupData?.description || ""}
                typeDesign={popupData?.type_design || "hog"}
                hog={popupData?.hog.title || ""}
                pwa={popupData?.power_app.title || ""}
                url={`${process.env.NEXT_PUBLIC_ENGINE_URL}/c/${popupData?._id}`}
                loading={loading}
                fields={popupData?.variables || []}
              />,
              document.body,
            )}
        </div>
      </div>
      <div className={styles.imageWrapper}>
        <Image src={thumbnail || default_image} fill sizes='500px' priority alt='Hog' />
      </div>
    </div>
  );
};

export default TemplateCard;
