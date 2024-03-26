import { Dispatch, SetStateAction, useState } from "react";
import { ClientsProps } from "@/typescript/interfaces/clients.interface";
import styles from "./styles.module.scss";
import LoadingSpinner from "@/components/Loading";
import Row from "../Row";
import PopupActions from "../PopupActions";
import PopupConfirm from "@/components/PopupConfirm";
import { useMessageToast } from "@/hooks/useMessageToast";
import { remove } from "@/services/fetch";
import { useTranslations } from "next-intl";
import { ENV } from "@/typescript/types/environment.enum";

interface ListProps {
  data: ClientsProps[];
  loading: boolean;
  fetch: () => void;
  setClientSelected: Dispatch<SetStateAction<ClientsProps | null>>;
}

const List = ({ data, loading, setClientSelected, fetch }: ListProps) => {
  const [showPopupEdit, setShowPopupEdit] = useState(false);
  const [showPopupDelete, setShowPopupDelete] = useState(false);
  const [clientId, setClientId] = useState<string | undefined>(undefined);
  const { notify, notifyError } = useMessageToast();
  const dict = useTranslations("dict");

  const handleDelete = async () => {
    try {
      if (clientId) {
        const data = await remove("client-customer", clientId, ENV.DASH);
        if (data.statusCode === 200) {
          setShowPopupDelete(false);
          setClientSelected(null);
          notify(dict("toast.client_delete"));
          fetch();
        } else {
          notifyError(dict("toast.client_delete_error"));
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    setShowPopupDelete(false);
    setShowPopupEdit(false);
  };

  return (
    <div className={styles.clients}>
      {loading ? (
        <LoadingSpinner />
      ) : data.length > 0 ? (
        data.map((client: ClientsProps) => (
          <Row
            key={client._id}
            client={client}
            onSelectClient={setClientSelected}
            onDelete={() => {
              setShowPopupDelete(true), setClientId(client._id);
            }}
            onEdit={() => {
              setShowPopupEdit(true), setClientId(client._id);
            }}
          />
        ))
      ) : (
        <p className={styles.empty}>{dict("clients.empty")}</p>
      )}
      {showPopupEdit && (
        <PopupActions
          requestType='PUT'
          clientId={clientId}
          title={dict("clients.popup_edit_title")}
          buttonText={dict("clients.popup_button")}
          setShowPopup={setShowPopupEdit}
          setClientSelected={setClientSelected}
          onCancel={handleClose}
          onSubmit={fetch}
        />
      )}
      {showPopupDelete && (
        <PopupConfirm
          onConfirm={handleDelete}
          onCancel={handleClose}
          setShowConfirmation={setShowPopupDelete}
          title={dict("popup.delete_title")}
          textCancel={dict("popup.cancel")}
          textAccept={dict("popup.confirm")}
        />
      )}
    </div>
  );
};

export default List;
