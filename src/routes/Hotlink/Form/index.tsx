import styles from "./styles.module.scss";
import { useFlakesContext } from "@/context/FlakesContext";
import { useEffect, useState } from "react";
import { Flake, Variablesinuse } from "@/typescript/interfaces/flakes.interface";
import { useMessageToast } from "@/hooks/useMessageToast";
import { useTranslations } from "next-intl";
import { useClientsContext } from "@/context/ClientsContext";
import { ClientsProps } from "@/typescript/interfaces/clients.interface";
import { post } from "@/services/fetch";

// Components
import Input from "@/components/Input";
import SectionTitle from "@/components/SectionTitle";
import Loading from "@/app/[locale]/(playground)/introduction/loading";
import Checkbox from "./Checkbox";
import { Fade } from "react-awesome-reveal";
import Icon from "@/components/Icon";
import Button from "@/components/Button";

const EmptyFormData = {
  typeFlake: "",
  flakeId: "",
  collection_id: "",
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
  const { flakes, difussionLink, selectedFlakeId, loading, getList, getDiffusionLink } = useFlakesContext();
  const [formInfo, setFormInfo] = useState<Variablesinuse[]>([]);
  const [formDataPost, setFormDataPost] = useState<Flake>(EmptyFormData);
  const [loadingButton, setLoadingButton] = useState<boolean>(false);

  const formVariableData = flakes.find(item => item._id === selectedFlakeId);

  useEffect(() => {
    if (formVariableData) {
      const { _id, variables_in_use } = formVariableData;

      const variablesData = variables_in_use.map(({ key, name, description, target, value }: Variablesinuse) => ({
        key,
        target,
        name,
        value: value || "",
        description,
      }));

      setFormDataPost({
        ...formDataPost,
        flakeId: _id,
        typeFlake: "flake_power_apps",
        variables: variablesData,
      });

      setFormInfo(variablesData);
    }
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
    const anyEmpty = formInfo.some(info => info.value?.trim() === "");
    if (anyEmpty) {
      notifyError(`${dict("toast.empty_fields")}`);
      return;
    }

    const response = await post("hotlinks/user", formDataPost);
    if (response.data.statusCode === 200) {
      setFormInfo(formInfo.map(info => ({ ...info, value: "" })));
      getList();
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

  return (
    <div className={styles.container}>
      <SectionTitle text={dict("hotlinks.form_title")} />
      {loading ? (
        <Loading />
      ) : flakes.length ? (
        <Fade triggerOnce>
          <form className={styles.form_container} onSubmit={handleSubmit}>
            <div className={styles.form}>
              {formInfo &&
                formInfo.map((info, index) => (
                  <Input
                    key={info.key}
                    type={info.target}
                    textLabel={info.description}
                    value={info.value!}
                    handleChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                      handleChange(e, index)
                    }
                    textHolder={info.placeholder!}
                    name={info.name}
                  />
                ))}
            </div>
            <Checkbox />
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
        </Fade>
      ) : null}
    </div>
  );
};

export default Form;
