import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import DragAndDrop from "@/components/DragAndDrop";
import { putFile } from "@/services/fetch";
import { ENV } from "@/typescript/types/api";
import { useTranslations } from "next-intl";
import { useMessageToast } from "@/hooks/useMessageToast";

const DragDrop = () => {
  const dict = useTranslations("dict");
  const { notify, notifyError } = useMessageToast();
  const [logo, setLogo] = useState<File | null>(null);
  const [banner, setBanner] = useState<File | null>(null);

  const handleFile = async () => {
    try {
      if (logo) {
        const response = await putFile(`/small-business/logo`, logo, ENV.DASHBOARD);
        if (!response.error && response.data.statusCode === 200) {
          notify(dict("toast.success_update"));
        }
      } else if (banner) {
        const response = await putFile(`/small-business/banner`, banner, ENV.DASHBOARD);
        if (!response.error && response.data.statusCode === 200) {
          notify(dict("toast.success_update"));
        }
      }
    } catch (error) {
      notifyError(dict("toast.error_update"));
    }
  };

  useEffect(() => {
    handleFile();
  }, [logo, banner]);

  console.log(logo);

  return (
    <section className={styles.drag_drop}>
      <div className={styles.logo}>
        <h6>Logo</h6>
        <DragAndDrop setFile={setLogo} img='Logo' file={logo} />
      </div>
      <div className={styles.banner}>
        <h6>Banner</h6>
        <DragAndDrop setFile={setBanner} img='Banner' />
      </div>
    </section>
  );
};

export default DragDrop;
