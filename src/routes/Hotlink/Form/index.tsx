import styles from "./styles.module.scss";
import Image from "next/image";
import HotlinkIcon from "@/../../public/icons/hotlink_icon_white.svg";
import { useFlakesContext } from "@/context/FlakesContext";
import { useEffect, useState } from "react";
import { Flake, Variablesinuse } from "@/typescript/interfaces/flakes.interface";
import { useMessageToast } from "@/hooks/useMessageToast";
import { useTranslations } from "next-intl";
import { useClientsContext } from "@/context/ClientsContext";
import { ClientsProps } from "@/typescript/interfaces/clients.interface";
import { post } from "@/services/fetch";

//Componentes
import Input from "@/components/Input";
import SectionTitle from "@/components/SectionTitle";
import Loading from "@/app/[locale]/(playground)/introduction/loading";
import Checkbox from "./Checkbox";

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
  const { flakes, selectedFlakeId, loading } = useFlakesContext();
  const [formInfo, setFormInfo] = useState<Variablesinuse[]>([]);

  const [formDataPost, setFormDataPost] = useState<Flake>(EmptyFormData);
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
    const anyEmpty = formInfo.some(info => info.value?.trim() === "");
    if (anyEmpty) {
      notifyError(`${dict("toast.empty_fields")}`);
      return;
    }
    const response = await post("hotlinks/user", formDataPost);
    if (response.data.statusCode === 200) {
      setFormInfo(formInfo.map(info => ({ ...info, value: "" })));
      setFormDataPost(EmptyFormData);
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

  return (
    <div className={styles.container}>
      <SectionTitle text={dict("hotlinks.form_title")} />
      {loading ? (
        <Loading />
      ) : (
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
          <button type='submit' className={styles.btn}>
            <Image src={HotlinkIcon} alt='' />
            {dict("hotlinks.form_btn")}
          </button>
        </form>
      )}
    </div>
  );
};

export default Form;
