import Input from "@/components/Input";
import styles from "./styles.module.scss";
import SectionTitle from "@/components/SectionTitle";
import Loading from "@/app/[locale]/(playground)/introduction/loading";
import { useFlakesContext } from "@/context/FlakesContext";
import { useEffect, useState } from "react";
import { Variablesinuse } from "@/typescript/interfaces/flakes.interface";
import { post } from "@/services/fetch";
import { ENV } from "@/typescript/types/environment.enum";
import PopupShare from "@/routes/Playground/PopupShare";
import Button from "@/components/Button";
import { useMessageToast } from "@/hooks/useMessageToast";
import { useTranslations } from "next-intl";

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
interface FormProps {
  setLoadingDots: (loading: boolean) => void;
}

const Form = ({ setLoadingDots }: FormProps) => {
  const dict = useTranslations("dict");
  const { notify, notifyError } = useMessageToast();
  const { flakes, selectedFlakeId, loading } = useFlakesContext();
  const [formInfo, setFormInfo] = useState<Variablesinuse[]>([]);
  const [showButton, setShowButton] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [formDataPost, setFormDataPost] = useState(EmptyFormData);
  const { setTime, setShowPreview, setPaUrl } = useFlakesContext();

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
    setLoadingDots(true);
    const response = await post("hotlinks/playground", formDataPost, ENV.DASH);
    if (response?.status === 200) {
      const { hotlink, message } = response.data.data.result;
      setPaUrl(`https://power-app-engine.vercel.app/${hotlink.power_app_hash}`);
      setTime();
      setShowPreview(true);
      setShowButton(true);
      setLoadingDots(false);
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

  useEffect(() => {
    setShowButton(false);
  }, [selectedFlakeId]);

  return (
    <div className={styles.container}>
      <SectionTitle text={dict("playground.form.title")} />
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
          <Button title={dict("playground.form.button_hotlink")} styleName='btn_playground_outline' type='submit' />
          {showButton && (
            <Button
              title={dict("playground.form.button_share")}
              styleName='btn2_playground_outline'
              onclick={() => setShowPopup(!showPopup)}
            />
          )}
          {showPopup && <PopupShare setShowPopup={() => setShowPopup(!showPopup)} />}
        </form>
      )}
    </div>
  );
};

export default Form;
