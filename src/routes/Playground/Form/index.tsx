import Input from "@/components/Input";
import styles from "./styles.module.scss";
import SectionTitle from "@/components/SectionTitle";
import Loading from "@/app/[locale]/(playground)/introduction/loading";
import { useFlakesContext } from "@/context/FlakesContext";
import { useEffect, useState } from "react";
import { Variablesinuse } from "@/typescript/interfaces/flakes.interface";
import { post } from "@/services/fetch";
import { ENV } from "@/typescript/types/environment.enum";
import { useMessageToast } from "@/hooks/useMessageToast";

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
  const { notify, notifyError } = useMessageToast();
  const { flakes, selectedFlakeId, loading, setHotlinkData } = useFlakesContext();
  const [formInfo, setFormInfo] = useState<Variablesinuse[]>([]);
  const [formDataPost, setFormDataPost] = useState(EmptyFormData);
  const { setTime, setShowPreview, fetchOpenGraphData } = useFlakesContext();

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

    const response = await post("hotlinks/playground", formDataPost, ENV.DASH);
    if (response?.status === 200) {
      const { hotlink, message } = response.data.data.result;
      setHotlinkData({ hotlink });
      notify(message);
      setTime();
      fetchOpenGraphData();
      setShowPreview(true);
    } else {
      console.log(response);
    }

    setFormDataPost(EmptyFormData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const updatedFormInfo = [...formInfo];
    updatedFormInfo[index].value = e.target.value;
    setFormInfo(updatedFormInfo);
  };

  return (
    <div className={styles.container}>
      <SectionTitle text='Campos' />
      {loading ? (
        <Loading />
      ) : (
        <form className={styles.form} onSubmit={handleSubmit}>
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
          <button className={styles.btn}>Generar Hotlink</button>
        </form>
      )}
    </div>
  );
};

export default Form;
