import Title from "@/components/Title";
import styles from "./styles.module.scss";
import Input from "@/components/Input";
import DragAndDrop from "@/components/DragAndDrop";
import { useTranslations } from "next-intl";
import { useState } from "react";
import Icon from "@/components/Icon";
import Button from "@/components/Button";

const Business = () => {
  const dict = useTranslations("dict.business");
  const [file, setFile] = useState<File | null>(null);

  // eslint-disable-next-line no-empty-function
  const handleChange = () => {};
  // eslint-disable-next-line no-empty-function
  const handleFile = () => {};

  return (
    <section className={styles.container_business}>
      <div className={styles.form_data}>
        <Title text={dict("form.title")} />
        <h4 className={styles.subtitle}>{dict("form.subtitle")}</h4>
        <form className={styles.form}>
          <div className={styles.input_name}>
            <Input
              textLabel={dict("form.name")}
              textHolder={dict("form.name")}
              type='text'
              name='name'
              value=''
              handleChange={handleChange}
            />
            <Input
              textLabel={dict("form.last_name")}
              textHolder={dict("form.last_name")}
              type='text'
              name='last_name'
              value=''
              handleChange={handleChange}
            />
          </div>
          <Input
            textLabel={dict("form.business_name")}
            textHolder={dict("form.business_name")}
            type='text'
            name='business_name'
            value=''
            handleChange={handleChange}
          />
          <div className={styles.select}>
            <label>{dict("form.type_business")}</label>
            <select>
              <option>Select industry</option>
            </select>
          </div>
          <Input
            textLabel={dict("form.describe_business")}
            textHolder={dict("form.describe_business")}
            type='textarea'
            name='describe_business'
            value=''
            handleChange={handleChange}
          />
        </form>
      </div>
      <div className={styles.data}>
        <section className={styles.drag_drop}>
          <div className={styles.logo}>
            <h6>Logo</h6>
            <DragAndDrop setFile={handleFile} />
          </div>
          <div className={styles.banner}>
            <h6>Banner</h6>
            <DragAndDrop setFile={handleFile} />
          </div>
        </section>
        <section className={styles.color_info}>
          <div className={styles.colors}>
            <h6>{dict("data.colors")}</h6>
            <div className={styles.container_circle}>
              <article className={styles.circle}></article>
              <article className={styles.circle}></article>
              <article className={styles.circle}>
                <Icon name='add' viewBox='0 0 20 22' width={35} height={35} strokeWidth={1} />
              </article>
            </div>
            <p className={styles.description}>{dict("data.description")}</p>
          </div>
          <form className={styles.add_info}>
            <h6 className={styles.subtitle}>{dict("data.add_info")}</h6>
            <div className={styles.input}>
              <label>{dict("data.website")}</label>
              <Input
                textHolder={dict("data.website")}
                type='text'
                name='website'
                value=''
                handleChange={handleChange}
              />
            </div>
            <div className={styles.input}>
              <label>{dict("data.instagram")}</label>
              <Input
                textHolder={dict("data.instagram")}
                type='text'
                name='instagram'
                value=''
                handleChange={handleChange}
              />
            </div>
            <div className={styles.input}>
              <label>{dict("data.phone")}</label>
              <Input textHolder={dict("data.phone")} type='text' name='phone' value='' handleChange={handleChange} />
            </div>

            <div className={styles.btn_next}>
              <Button title='Next' />
            </div>
          </form>
        </section>
      </div>
    </section>
  );
};

export default Business;
