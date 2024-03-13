import Input from "@/components/Input";
import styles from "./styles.module.scss";
import SectionTitle from "@/components/SectionTitle";

interface PropsForm {
  setUrl: (url: string) => void;
  url: string;
  submitForm: (e: React.FormEvent<HTMLFormElement>) => void;
}

const Form = ({ setUrl, url, submitForm }: PropsForm) => {
  const handleSetUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  return (
    <div className={styles.container}>
      <SectionTitle text='Campos' />
      <form onSubmit={submitForm}>
        <Input type='text' textLabel='Título' value={url} handleChange={handleSetUrl} textHolder='Enter URL' />
        <button type='submit'>Generate Preview</button>
      </form>
    </div>
  );
};

export default Form;
