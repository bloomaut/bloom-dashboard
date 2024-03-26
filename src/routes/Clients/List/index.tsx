import { Dispatch, SetStateAction } from "react";
import { ClientsProps } from "@/typescript/interfaces/clients.interface";
import styles from "./styles.module.scss";
import LoadingSpinner from "@/components/Loading";
import Row from "../Row";

interface ListProps {
  data: ClientsProps[];
  loading: boolean;
  setClientSelected: Dispatch<SetStateAction<ClientsProps | null>>;
  setShowPopupDelete: Dispatch<SetStateAction<boolean>>;
  setShowPopupEdit: Dispatch<SetStateAction<boolean>>;
  setClientId: Dispatch<SetStateAction<string | undefined>>;
}

const List = ({ data, loading, setClientSelected, setShowPopupDelete, setShowPopupEdit, setClientId }: ListProps) => {
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
        <p className={styles.empty}>No hay clientes disponibles</p>
      )}
    </div>
  );
};

export default List;
