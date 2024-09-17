import styles from "./styles.module.scss";
import { Dispatch, SetStateAction, useState } from "react";
import { useCloseDropdown } from "@/hooks/useCloseDropdown";
// Components
import Button from "@/components/Button";
import Title from "@/components/Title";
import { useTranslations } from "next-intl";
import Icon from "@/components/Icon";
import Image from "next/image";
import TitleAndDescription from "./TitleAndDescription";
import Input from "@/components/Input";

interface Fields {
  title: string;
  description: string;
}

interface PopupDesignProps {
  onConfirm?: () => void;
  onCancel?: () => void;
  setShowConfirmation: (value: SetStateAction<boolean>) => void;
  thumbnail: string;
  title: string;
  description: string;
  post: string;
  pwa: string;
  fields?: Fields[];
  url: string;
  loading?: boolean;
}

const PopupDesign = ({
  onConfirm,
  onCancel,
  setShowConfirmation,
  thumbnail,
  title,
  description,
  post,
  pwa,
  fields,
  url,
}: PopupDesignProps) => {
  const { dropdownRef } = useCloseDropdown(setShowConfirmation);
  const dict = useTranslations("dict.designs.create_design.popup");
  const [copy, setCopy] = useState<boolean>(false);

  const handleInput = () => {
    //En caso de poderse editar el input
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(url);
    setCopy(true);
  };

  return (
    <section className={styles.popup_container}>
      <div className={styles.container} ref={dropdownRef}>
        <Title text={dict("design")} />
        <div className={styles.btn_close}>
          <button onClick={onCancel} type='button'>
            <Icon name='close' width={30} height={30} strokeColor='#111827' />
          </button>
        </div>

        <div className={styles.content}>
          <Image src={thumbnail} alt={title} width={240} height={240} />

          <div className={styles.info}>
            <h2>{dict("info")}</h2>
            <TitleAndDescription title={dict("title")} description={title} />
            <TitleAndDescription title={dict("description")} description={description} />
            <div className={styles.post_container}>
              <TitleAndDescription title={dict("post")} description={post} />
              <TitleAndDescription title={dict("pwa")} description={pwa} />
            </div>
            <h2>{dict("fields")}</h2>
            {fields && (
              <div className={styles.fields}>
                {fields.map((field, index) => (
                  <TitleAndDescription key={index} title={field.title} description={field.description} />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={styles.buttons}>
          <p className={styles.share}>{dict("share")}</p>
          <div className={styles.copy_container}>
            <Input
              name={title}
              value={url || ""}
              handleChange={handleInput}
              textHolder='https://app.small.ar/example'
              type='text'
            />
            <Button
              title={copy ? dict("copied") : dict("copy")}
              styleName={`${copy ? "popup_design_btn_copied" : "popup_design_btn"}`}
              onclick={copyToClipboard}
            />
          </div>
          <div className={styles.download}>
            <Button title={dict("download")} icon={<Icon name='arrow_download' />} styleName='popup_design_download' />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PopupDesign;
