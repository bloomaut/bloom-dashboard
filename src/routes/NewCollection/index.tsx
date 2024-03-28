import { useTranslations } from "next-intl";
import styles from "./styles.module.scss";
import Breadcrumb from "@/components/Breadcrumb";
import Input from "@/components/Input";
import { useState } from "react";

const NewCollectionPage = () => {
  const dict = useTranslations("dict.collections.new_collection");
  const [form, setForm] = useState({
    name: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };

  return (
    <section className={styles.new_collection}>
      <Breadcrumb title={dict("title")} />
      <div className={styles.container}>
        <div className={styles.template}>
          <div className={styles.sm_img}></div>
          <div className={styles.lg_img}></div>
        </div>
        <div className={styles.form}>
          <Input
            type='text'
            textLabel={dict("input")}
            textHolder={dict("input")}
            name='name'
            value={form.name}
            handleChange={handleChange}
          />
          <div className={styles.select}>
            <label>{dict("select")}</label>
            <select>
              <option>Hola</option>
            </select>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewCollectionPage;
