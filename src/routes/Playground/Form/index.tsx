import styles from "./styles.module.scss";
import { useFlakesContext } from "@/context/FlakesContext";
import { useEffect, useState } from "react";
import { Flake, Variablesinuse } from "@/typescript/interfaces/flakes.interface";
import { useMessageToast } from "@/hooks/useMessageToast";
import { useTranslations } from "next-intl";
import { useOpenGraphContext } from "@/context/OpenGraphContext";
import axios from "axios";
import { Fade } from "react-awesome-reveal";
// Components
import Input from "@/components/Input";
import PopupShare from "@/routes/Playground/PopupShare";
import Button from "@/components/Button";
import SectionTitle from "@/components/SectionTitle";
import Loading from "@/app/[locale]/(playground)/introduction/loading";
import Icon from "@/components/Icon";

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
  const { setTime, setShowPreview, setPaUrl, setLoadingDots, setPreviewData } = useOpenGraphContext();
  const { flakes, selectedFlakeId, loading } = useFlakesContext();
  const [formInfo, setFormInfo] = useState<Variablesinuse[]>([]);
  const [showButton, setShowButton] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const anyEmpty = formInfo.some(info => info.value?.trim() === "");
    if (anyEmpty) {
      notifyError(`${dict("toast.empty_fields")}`);
      return;
    }
    setLoadingDots(true);

    // Postear el formulario al backend salteandote la autorización de auth0
    const response = await axios.post("/api/hotlinks", formDataPost, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response?.status === 200) {
      const { url, opengraph } = response.data.data.result;
      setPaUrl(url);
      setPreviewData(opengraph);
      setTime();
      setShowPreview(true);
      setShowButton(true);
      setLoadingDots(false);
    } else {
      notifyError(`${dict("toast.error_tryagain")}`);
    }

    setFormDataPost(EmptyFormData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
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
          <Fade triggerOnce>
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
          </Fade>
          <Button
            title={dict("playground.form.button_hotlink")}
            styleName='btn_playground_outline'
            icon={<Icon name='generate_hotlink' viewBox='0 0 20 20' strokeColor='#fff' />}
            type='submit'
          />
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
