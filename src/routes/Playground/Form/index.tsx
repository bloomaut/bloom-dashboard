import Input from "@/components/Input";
import styles from "./styles.module.scss";
import SectionTitle from "@/components/SectionTitle";
import Loading from "@/app/[locale]/(playground)/introduction/loading";
import { useFlakesContext } from "@/context/FlakesContext";
import { useEffect, useState } from "react";
import { Variablesinuse } from "@/typescript/interfaces/flakes.interface";

interface PropsForm {
  setUrl: (url: string) => void;
  url: string;
  submitForm: (e: React.FormEvent<HTMLFormElement>) => void;
}

const Form = ({ setUrl, url, submitForm }: PropsForm) => {
  const { flakes, selectedFlakeId, loading } = useFlakesContext();
  const [formInfo, setFormInfo] = useState<Variablesinuse[]>([]);

  const formVariables = flakes.find(item => item._id === selectedFlakeId);

  useEffect(() => {
    if (formVariables) {
      setFormInfo(formVariables.variables_in_use);
    }
  }, [formVariables]);

  const handleSetUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  return (
    <div className={styles.container}>
      <SectionTitle text='Campos' />
      {loading ? (
        <Loading />
      ) : (
        <form className={styles.form} onSubmit={submitForm}>
          {formInfo &&
            formInfo.map(info => (
              <Input
                key={info.key}
                type={info.target}
                textLabel={info.description}
                value={url}
                handleChange={handleSetUrl}
                textHolder={info.placeholder}
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
