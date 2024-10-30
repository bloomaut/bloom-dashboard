import styles from "./styles.module.scss";
import { useTranslations } from "next-intl";
import { useCloseDropdown } from "@/hooks/useCloseDropdown";
import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import axios from "@/utils/axiosConfig";
import { setClientId } from "@/store/features/ricardoSlice";

const RoleComponent = () => {
  const dict = useTranslations("dict.login");
  const dispatch = useAppDispatch();
  const [openDrop, setOpenDrop] = useState(false);
  const [selectedRicardo, setSelectedRicardo] = useState("");
  const { dropdownRef } = useCloseDropdown(setOpenDrop);
  const { ricardosData, clientId } = useAppSelector(state => state.ricardosData);

  useEffect(() => {
    const storedClientId = localStorage.getItem("client_id");
    if (storedClientId) {
      dispatch(setClientId(storedClientId));
    }
  }, []);

  const handleOpenDrop = () => {
    setOpenDrop(!openDrop);
  };

  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRicardo(event.target.value);
  };

  const handleClientId = async () => {
    localStorage.setItem("client_id", selectedRicardo);
    dispatch(setClientId(selectedRicardo));
    setOpenDrop(false);

    try {
      await axios.get("/api/proxy", {
        headers: {
          "X-Client-ID": selectedRicardo,
        },
      });
    } catch (error) {
      console.error("Error fetching from proxy:", error);
    }
  };

  const handleClearClientId = () => {
    localStorage.removeItem("client_id");
    dispatch(setClientId(""));
    setOpenDrop(false);
  };

  return (
    <div className={styles.role_container}>
      <div onClick={handleOpenDrop}>
        <Icon name='users' viewBox='0 0 25 20' strokeColor='#381d2a' width={25} />
        <Icon name='arrow_down_chevron' viewBox='-5 0 25 1' strokeColor='#381d2a' />
      </div>
      <div className={`${styles.dropdown} ${openDrop ? styles.showdrop : ""}`} ref={dropdownRef}>
        <p className={styles.title}>{dict("role.title")}</p>
        <div className={styles.roles}>
          <select className={styles.role} value={selectedRicardo} onChange={handleRoleChange}>
            <option value=''>{dict("role.trade")}</option>
            {ricardosData?.map(ricardo => (
              <option key={ricardo.id} value={ricardo.id!}>
                {ricardo.name}
              </option>
            ))}
          </select>
          <Button title={dict("role.button")} onclick={handleClientId} />
          {clientId && <Button title={dict("role.reset")} onclick={handleClearClientId} styleName='white' />}
        </div>
      </div>
    </div>
  );
};

export default RoleComponent;
