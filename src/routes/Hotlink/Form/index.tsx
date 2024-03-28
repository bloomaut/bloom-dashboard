import styles from "./styles.module.scss";
import { useFlakesContext } from "@/context/FlakesContext";
import { useEffect, useState } from "react";
import { Variablesinuse } from "@/typescript/interfaces/flakes.interface";
import { useMessageToast } from "@/hooks/useMessageToast";
import { useTranslations } from "next-intl";
import axios from "axios";
import { useOpenGraphContext } from "@/context/OpenGraphContext";

//Componentes
import Input from "@/components/Input";
import SectionTitle from "@/components/SectionTitle";
import Loading from "@/app/[locale]/(playground)/introduction/loading";
import Image from "next/image";
import HotlinkIcon from "@/../../public/icons/hotlink_icon_white.svg";
import SearchContainer from "./SearchContainer";
import List from "@/routes/Clients/List";

const EmptyFormData = {
  typeFlake: "",
  flakeId: "",
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
  const { notifyError } = useMessageToast();
  const { setPaUrl } = useOpenGraphContext();
  const { flakes, selectedFlakeId, loading } = useFlakesContext();
  const [formInfo, setFormInfo] = useState<Variablesinuse[]>([]);

  const [formDataPost, setFormDataPost] = useState(EmptyFormData);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const anyEmpty = formInfo.some(info => info.value?.trim() === "");
    if (anyEmpty) {
      notifyError(`${dict("toast.empty_fields")}`);
      return;
    }

    const response = await axios.post("/api/hotlinks", formDataPost, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response?.status === 200) {
      const { hotlink, opengraph } = response.data.data.result;
      setPaUrl(hotlink.url);
    } else {
      notifyError(`${dict("toast.error_tryagain")}`);
    }

    setFormDataPost(EmptyFormData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const updatedFormInfo = [...formInfo];
    updatedFormInfo[index].value = e.target.value;
    setFormInfo(updatedFormInfo);
  };

  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);

    console.log(isChecked);
  };

  return (
    <div>
      <div className={styles.container}>
        <SectionTitle text='Campos' />
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
                    handleChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, index)}
                    textHolder={info.placeholder!}
                    name={info.name}
                  />
                ))}
            </div>
            <div className={styles.checkbox_container}>
              <label>
                <input type='checkbox' checked={isChecked} onChange={handleCheckboxChange} />
                Llenar variables con cliente
              </label>
              <p>*Campos que se puedan completar con cliente</p>
            </div>
            {isChecked && <SearchContainer />}
            {/*             <button type='submit' className={styles.btn}>
              <Image src={HotlinkIcon} alt='' />
              Generar Hotlink
            </button>
            */}
          </form>
        )}
      </div>
    </div>
  );
};

export default Form;
