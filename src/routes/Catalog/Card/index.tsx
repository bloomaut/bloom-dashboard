import Button from "@/components/Button";
import styles from "./styles.module.scss";
import { DatasetProps } from "@/typescript/interfaces/catalog.interface";
import Icon from "@/components/Icon";
import PopupChildren from "@/components/PopupChildren";
import { useState } from "react";
import Input from "@/components/Input";
import { useCatalogContext } from "@/context/CatalogContext";

const Card = ({ name, _id }: DatasetProps) => {
  const [showPopupEdit, setShowPopupEdit] = useState(false);
  const [catalogName, setCatalogName] = useState(name);
  const { updateDataset } = useCatalogContext();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await updateDataset(_id, catalogName);
    } catch (error) {
      console.error("Error updating dataset:", error);
    } finally {
      setShowPopupEdit(false);
    }
  };

  return (
    <div className={styles.card}>
      <h1 className={styles.name}>{name}</h1>
      <div className={styles.btn_container}>
        <Button
          title=''
          styleName='btn_square'
          icon={<Icon name='edit' width={20} height={20} strokeColor='#fff' viewBox='0 0 20 23' />}
          onclick={() => setShowPopupEdit(true)}
        />
        <Button
          title=''
          styleName='btn_square'
          icon={<Icon name='delete' width={20} height={20} strokeColor='#fff' viewBox='0 0 23 22' />}
        />
      </div>
      {showPopupEdit && (
        <PopupChildren
          onConfirm={handleSubmit}
          onCancel={() => setShowPopupEdit(false)}
          setShowConfirmation={setShowPopupEdit}
          textCancel={"Cancelar"}
          textAccept={"Crear"}
        >
          <Input
            type='text'
            textHolder={"Nombre"}
            name={"Name"}
            value={catalogName}
            handleChange={e => setCatalogName(e.target.value)}
          />
        </PopupChildren>
      )}
    </div>
  );
};

export default Card;
