import styles from "./styles.module.scss";
import { useFlakesContext } from "@/context/FlakesContext";
import { useEffect, useState } from "react";
import { Flake, VariableInUse } from "@/typescript/interfaces/flakes.interface";
import { useMessageToast } from "@/hooks/useMessageToast";
import { useTranslations } from "next-intl";
import { useClientsContext } from "@/context/ClientsContext";
import { ClientsProps } from "@/typescript/interfaces/clients.interface";
import { post, postFile } from "@/services/fetch";

// Components
import Input from "@/components/Input";
import SectionTitle from "@/components/SectionTitle";
import Checkbox from "./Checkbox";
import Icon from "@/components/Icon";
import Button from "@/components/Button";

const EmptyFormData = {
  flakeId: "",
  customer_id: "",
  variables: [
    {
      key: "",
      target: "",
      name: "",
      value: "",
      description: "",
    },
  ],
};

const Form = () => {
  const dict = useTranslations("dict");
  const { clientSelected } = useClientsContext();
  const { notify, notifyError } = useMessageToast();
  const { flakes, selectedFlakeId, getHotlinkList, totalHotlinks, getDiffusionLink } = useFlakesContext();
  const [formInfo, setFormInfo] = useState<VariableInUse[]>([]);
  const [formDataPost, setFormDataPost] = useState<Flake>(EmptyFormData);
  const [loadingButton, setLoadingButton] = useState<boolean>(false);
  const [fileImage, setFileImage] = useState<string>("");

  const formVariableData = flakes.find(item => item._id === selectedFlakeId);

  useEffect(() => {
    if (formVariableData) {
      const { _id, variables_in_use } = formVariableData;

      const variablesData = variables_in_use.map(({ key, name, description, target, value }: VariableInUse) => ({
        key,
        target,
        name,
        value: value || "",
        description,
      }));

      setFormDataPost({
        ...formDataPost,
        flakeId: _id,
        variables: variablesData,
      });

      setFormInfo(variablesData);
    }
    setFileImage(""); //reset de input de imagen al cambiar el design
  }, [formVariableData]);

  useEffect(() => {
    if (clientSelected && formInfo.length > 0) {
      const updatedFormInfo = formInfo.map(info => {
        const clientValue = clientSelected[info.name as keyof ClientsProps];
        return { ...info, value: clientValue || "" };
      });
      setFormInfo(updatedFormInfo);

      const updatedFormDataPost = {
        ...formDataPost,
        customer_id: clientSelected._id ?? "",
        variables: updatedFormInfo.map(({ key, target, name, value, description }) => ({
          key,
          target,
          name,
          value: value || "",
          description,
        })),
      };
      setFormDataPost(updatedFormDataPost);
    }
  }, [clientSelected]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Si hay un campo vacio arrojar error y salir
    const anyEmpty = formInfo.filter(i => i.target !== "image").some(info => info.value?.trim() === "");
    if (anyEmpty) {
      notifyError(`${dict("toast.empty_fields")}`);
      return;
    }

    const response = await post("hotlinks/user", formDataPost);
    if (response.data.statusCode === 200) {
      setFormInfo(formInfo.map(info => ({ ...info, value: "" })));
      getHotlinkList(0, totalHotlinks);
      notify(`${dict("toast.success_hotlink")}`);
    } else {
      notifyError(`${dict("toast.error_tryagain")}`);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
    const updatedFormInfo = [...formInfo];
    updatedFormInfo[index].value = e.target.value;
    setFormInfo(updatedFormInfo);

    const updatedFormDataPost = {
      ...formDataPost,
      variables: updatedFormInfo.map(({ key, target, name, value, description }) => ({
        key,
        target,
        name,
        value: value || "",
        description,
      })),
    };
    setFormDataPost(updatedFormDataPost);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
    const fileInput = e.target as HTMLInputElement;
    const fileExists = fileInput?.files?.[0];

    if (fileExists) {
      setFileImage(fileExists.name);
      const response = await postFile("files/upload/file", fileExists);

      if (response.data.statusCode === 201) {
        // Actualizo el formPost
        const updatedForm = [...formInfo];
        updatedForm[index].value = e.target.value;
        setFormInfo(updatedForm);
        // Actualizo el formPost
        const updatedFormInfo = formInfo.map(e =>
          e.target === "image" ? { ...e, value: response.data.result.file.url } : e,
        );

        const updatedFormDataPost = {
          ...formDataPost,
          variables: updatedFormInfo.map(({ key, target, name, value, description }) => ({
            key,
            target,
            name,
            value: value || "",
            description,
          })),
        };

        setFormDataPost(updatedFormDataPost);
        notify(`${dict("toast.success_img")}`);
      } else {
        notifyError(`${dict("toast.error_img")}`);
      }
    }
  };

  const handleCopyClick = async () => {
    setLoadingButton(true);
    const link = await getDiffusionLink(selectedFlakeId);

    if (link) {
      navigator.clipboard.writeText(link).then(function () {
        notify(`${dict("playground.popup.copy_success")}`);
      });
      setLoadingButton(false);
    } else {
      notifyError(dict("playground.popup.no_diffusion_link"));
      setLoadingButton(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === "d") {
        e.preventDefault();
        handleCopyClick();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedFlakeId]);

  return (
    <div className={styles.container}>
      {formInfo.length !== 0 && <SectionTitle text={dict("hotlinks.form_title")} />}

      {flakes.length ? (
        <form className={styles.form_container} onSubmit={handleSubmit}>
          {formInfo.length !== 0 && (
            <>
              <div className={styles.form}>
                {formInfo.map((info, index) =>
                  info.target === "image" ? (
                    <div className={styles.input_box} key={info.key}>
                      <div className={styles.input_real}>
                        <Input
                          key={info.key}
                          type='file'
                          textLabel={info.description}
                          value={info.value!}
                          handleChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                            handleImageChange(e, index)
                          }
                          textHolder={info.placeholder!}
                          name={info.name}
                        />
                      </div>

                      <div className={styles.input_custom}>
                        {info.description && <label className={styles.label}>{info.description}</label>}
                        <input type='text' className={styles.input} defaultValue={fileImage || ""} />
                        <div className={styles.icon_add}>
                          <Icon name='add' strokeColor='#ff3d02' strokeWidth={2.5} />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Input
                      key={info.key}
                      type='text'
                      textLabel={info.description}
                      value={info.value!}
                      handleChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                        handleChange(e, index)
                      }
                      textHolder={info.placeholder!}
                      name={info.name}
                    />
                  ),
                )}
              </div>
              <Checkbox />
            </>
          )}

          <div className={styles.btn_container}>
            <Button
              title={dict("hotlinks.form_btn")}
              styleName='btn_reverse'
              icon={<Icon name='hotlink' width={22} height={22} viewBox='0 0 30 34' className='hotlink_light' />}
              type='submit'
            />
            <Button
              title={dict("hotlinks.diffusion_link")}
              styleName='btn_outline'
              loading={loadingButton}
              onclick={handleCopyClick}
            />
          </div>
        </form>
      ) : null}
    </div>
  );
};

export default Form;
