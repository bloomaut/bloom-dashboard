"use client";
import styles from "./styles.module.scss";

interface PropsForm {
  setUrl: (url: string) => void;
  url: string;
  submitForm: (e: React.FormEvent<HTMLFormElement>) => void;
}

const Form = ({ setUrl, url, submitForm }: PropsForm) => {
  return (
    <div className={styles.container}>
      <form onSubmit={submitForm}>
        <input type='text' value={url} onChange={e => setUrl(e.target.value)} placeholder='Enter URL' />
        <button type='submit'>Generate Preview</button>
      </form>
    </div>
  );
};

export default Form;
