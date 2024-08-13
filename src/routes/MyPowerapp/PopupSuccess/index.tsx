import styles from "./styles.module.scss";
import { useCloseDropdown } from "@/hooks/useCloseDropdown";
import Image from "next/image";
import success from "/public/assets/success.png";
import Title from "@/components/Title";
import { useTranslations } from "next-intl";
import Button from "@/components/Button";
import { Link } from "@/navigation";

interface Props {
  setShowConfirmation: (value: React.SetStateAction<boolean>) => void;
}

const PopupSuccess = ({ setShowConfirmation }: Props) => {
  const { dropdownRef } = useCloseDropdown(setShowConfirmation);
  const dict = useTranslations("dict.business.my-powerapp");

  return (
    <section className={styles.popup_container}>
      <div className={styles.container} ref={dropdownRef}>
        <div className={styles.title_container}>
          <Image src={success} width={70} height={70} alt='success logo' />
          <div className={styles.congratulation}>
            <Title text={dict("congratulation")} />
            <p>{dict("success_subtitle")}</p>
          </div>
        </div>
        <p className={styles.success_text}>{dict("success_text")}</p>
        <Link href='/hotlink'>
          <Button title={dict("button_first_link")} />
        </Link>
      </div>
    </section>
  );
};

export default PopupSuccess;
