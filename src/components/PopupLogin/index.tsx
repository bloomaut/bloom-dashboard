import styles from "./styles.module.scss";
import Image from "next/image";
import closeIcon from "/public/icons/close.svg";
import { useTranslations } from "next-intl";
import { useCloseDropdown } from "@/hooks/useCloseDropdown";
import { useMessageToast } from "@/hooks/useMessageToast";
import Link from "next/link";
import ArrowIcon from "/public/icons/arrow_left.svg";
import { useRouter } from "next/navigation";

interface PopupLoginProps {
  setShowPopup: (value: boolean) => void;
}

const PopupLogin = ({ setShowPopup }: PopupLoginProps) => {
  const { notify, notifyError } = useMessageToast();
  const { dropdownRef } = useCloseDropdown(setShowPopup);
  const dict = useTranslations("dict.popupLogin");
  const router = useRouter();

  const handleCancel = () => {
    setShowPopup(false);
  };

  return (
    <section className={styles.container}>
      <div className={styles.inner_container} ref={dropdownRef}>
        <button className={styles.btn_back} onClick={() => router.back()}>
          <Image src={ArrowIcon} alt='arrow' className={styles.arrow} width={15} height={20} />
          <p className={styles.text}>{dict("link")}</p>
        </button>
        <div className={styles.content}>
          <h2 className={styles.title}>{dict("title")}</h2>
          <Link href='/api/auth/login' className={styles.btn}>
            <p>{dict("login")}</p>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopupLogin;
