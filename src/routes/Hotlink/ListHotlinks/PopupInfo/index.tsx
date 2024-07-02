import styles from "./styles.module.scss";
import { SetStateAction, useEffect, useState } from "react";
import { useCloseDropdown } from "@/hooks/useCloseDropdown";
import { Variable } from "@/typescript/interfaces/hotlink.interface";
import Icon from "@/components/Icon";

interface PopupChildrenInfo {
  setShowConfirmation: (value: SetStateAction<boolean>) => void;
  title?: string;
  hotlinkInfo: Variable[];
}

const PopupInfo = ({ setShowConfirmation, title, hotlinkInfo }: PopupChildrenInfo) => {
  const { dropdownRef } = useCloseDropdown(setShowConfirmation);

  return (
    <section className={styles.popup_container}>
      <div className={styles.container} ref={dropdownRef}>
        <p>{title}</p>
        <div className={styles.variable_info}>
          {hotlinkInfo?.map(info => (
            <div key={info.key} className={styles.info_container}>
              <p className={styles.name}>
                <Icon
                  name='info'
                  width={25}
                  height={25}
                  strokeColor='#7f7f7f'
                  strokeWidth={1.5}
                  viewBox='0 1 20 25'
                  title={info.description}
                />
                {info.name}
              </p>
              <p className={styles.value}>{info.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopupInfo;
