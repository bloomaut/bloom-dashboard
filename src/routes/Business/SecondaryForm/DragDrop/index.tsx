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
  const [file, setFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  const handleFile = async () => {
    try {
      if (file) {
        const response = await putFile(`/small-business/logo`, file, ENV.DASHBOARD);
        if (!response.error && response.data.statusCode === 200) {
          notify(dict("toast.success_update"));
        }
      } else if (bannerFile) {
        const response = await putFile(`/small-business/banner`, bannerFile, ENV.DASHBOARD);
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
  }, [file, bannerFile]);

  console.log(file);

  return (
    <section className={styles.drag_drop}>
      <div className={styles.logo}>
        <h6>Logo</h6>
        <DragAndDrop setFile={setFile} img='Logo' file={file} />
      </div>
      <div className={styles.banner}>
        <h6>Banner</h6>
        <DragAndDrop setFile={setBannerFile} img='Banner' />
      </div>
    </section>
  );
};

export default DragDrop;
