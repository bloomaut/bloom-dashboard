import { SetStateAction, useState } from "react";
import { useCloseDropdown } from "@/hooks/useCloseDropdown";
import { useMessageToast } from "@/hooks/useMessageToast";
import { useAppSelector } from "@/store/hooks";
import { update } from "@/services/fetch";
import { ENV } from "@/typescript/types/api";

import styles from "./styles.module.scss";
import Button from "@/components/Button";
import Title from "@/components/Title";
import Icon from "@/components/Icon";

interface PopupSubdomainsProps {
  onConfirm?: (landingEngineId: number) => void;
  onCancel?: () => void;
  setShowConfirmation: (value: SetStateAction<boolean>) => void;
  landingId: string;
  title: string | null;
}

interface InitialValuesProps {
  landingEngineId: string;
}

const initialValues: InitialValuesProps = {
  landingEngineId: "",
};

const PopupSubdomains = ({ onConfirm, onCancel, setShowConfirmation, landingId, title }: PopupSubdomainsProps) => {
  const { dropdownRef } = useCloseDropdown(setShowConfirmation);
  const { notify, notifyError } = useMessageToast();
  const [loading, setLoading] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const subdomainsData = useAppSelector(state => state.subdomainsData);
  const [formData, setFormData] = useState<InitialValuesProps>(initialValues);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevState: InitialValuesProps) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowError(false);
    if (formData.landingEngineId) {
      setLoading(true);
      const data = await update(
        `subdomains/flake-landing/${formData.landingEngineId}`,
        { landing_id: landingId },
        undefined,
        ENV.DASHBOARD,
      );
      if (data.statusCode === 201) {
        setLoading(false);
        notify("Dominio del sitio web actualizado con éxito");
        if (onConfirm) {
          onConfirm(parseInt(formData.landingEngineId));
        }
        if (onCancel) {
          onCancel();
        }
      } else {
        setLoading(false);
        notifyError("Ha ocurrido un error actualizando el dominio del sitio web");
      }
    } else {
      setShowError(true);
    }
  };

  return (
    <form className={styles.popup_container} onSubmit={handleSubmit}>
      <div className={styles.container} ref={dropdownRef}>
        <Title text={"Asignar dominio a sitio web"} />
        <p>
          <strong>Sitio web:</strong> {title}
        </p>
        <div className={styles.btn_close}>
          <button onClick={onCancel} type='button'>
            <Icon name='close' width={30} height={30} strokeColor='#111827' />
          </button>
        </div>
        {subdomainsData.subdomains.length > 0 ? (
          <>
            <div className={styles.content}>
              <div className={styles.select_type}>
                <label className={styles.label}>
                  * El dominio será desasignado de cualquier otro sitio web si se encuentra en uso.
                </label>
                <select
                  className={styles.select}
                  name='landingEngineId'
                  value={formData.landingEngineId || ""}
                  onChange={handleChange}
                >
                  <option value='' selected>
                    Seleccionar dominio
                  </option>
                  {subdomainsData.subdomains.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.full_domain}
                    </option>
                  ))}
                </select>
                {showError && <p className={styles.error}>Elija una dominio para asignar al sitio web</p>}
              </div>
            </div>
            <div className={styles.buttons}>
              <Button title='Cancelar' onclick={onCancel} styleName='btn_outline' />
              <Button title='Asignar' type='submit' loading={loading} />
            </div>
          </>
        ) : (
          <div>Aún no tienes dominios para asignar a tus páginas web.</div>
        )}
      </div>
    </form>
  );
};

export default PopupSubdomains;
