import styles from "./styles.module.scss";
import { useState } from "react";
import { ClientsProps } from "@/typescript/interfaces/clients.interface";
import { useMessageToast } from "@/hooks/useMessageToast";
import { remove } from "@/services/fetch";
import { useTranslations } from "next-intl";
import { useClientsContext } from "@/context/ClientsContext";
// Components
import Row from "../Row";
import PopupActions from "../PopupActions";
import LoadingSpinner from "@/components/Loading";
import PopupConfirm from "@/components/PopupConfirm";
import { Fade } from "react-awesome-reveal";

const List = () => {
  const { loading, fetchClients, setClientSelected, filteredClients } = useClientsContext();
  const [showPopupEdit, setShowPopupEdit] = useState(false);
  const [showPopupDelete, setShowPopupDelete] = useState(false);
  const [clientId, setClientId] = useState<string | undefined>(undefined);
  const { notify, notifyError } = useMessageToast();
  const dict = useTranslations("dict");

  const handleDelete = async () => {
    if (clientId) {
      const data = await remove("client-customer", clientId);
      if (data.statusCode === 200) {
        setShowPopupDelete(false);
        setClientSelected(null);
        notify(dict("toast.client_delete"));
        fetchClients();
      } else {
        notifyError(dict("toast.client_delete_error"));
      }
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
      ) : filteredClients.length ? (
        <Fade cascade damping={0.3} className={styles.fade}>
          {filteredClients.map((client: ClientsProps) => (
            <Row
              key={client._id}
              client={client}
              onDelete={() => {
                setShowPopupDelete(true), setClientId(client._id);
              }}
              onEdit={() => {
                setShowPopupEdit(true), setClientId(client._id);
              }}
            />
          ))}
        </Fade>
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
          onCancel={handleClose}
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
