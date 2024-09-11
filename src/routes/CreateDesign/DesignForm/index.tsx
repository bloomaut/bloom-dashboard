import { useDesignContext } from "@/context/DesignContext";
import styles from "./styles.module.scss";
import Image from "next/image";
import InputDesign from "../InputDesign";
import DragAndDrop from "@/components/DragAndDrop";
import Button from "@/components/Button";
import { useTranslations } from "next-intl";

const DesignForm = () => {
  const { designSelected } = useDesignContext();
  const dict = useTranslations("dict.designs.create_design");

  return (
    <section className={styles.step_two}>
      <div className={styles.design_preview}>
        <h4 className={styles.img_title}>{dict("title")}</h4>
        <div className={styles.img_container}>
          <Image
            src={designSelected?.flake.thumbnail || ""}
            alt={designSelected?.flake.title || ""}
            width={100}
            height={100}
          />
        </div>
        <div className={styles.img_form}>
          <InputDesign description={dict("input_title")} target='text' name='title' value='' />
          <InputDesign description={dict("input_description")} target='text' name='description' value='' />
          <div className={styles.pwa_text}>
            <p className={styles.pwa}>{dict("pwa_diffusion")}</p>
            <p className={styles.name}>Name - Diffuse</p>
          </div>
        </div>
      </div>
      <div className={styles.design_form}>
        <h3 className={styles.title}>
          <span>Post:</span> {dict("promotion")}
        </h3>
        <div className={styles.form_container}>
          <p className={styles.field}>{dict("fields")}</p>
          <form>{designSelected?.variables.map(field => <InputDesign {...field} />)}</form>
        </div>
        <DragAndDrop type='image' file={null} setFile={null} currentImage={null} />
        <div className={styles.user_variables}>
          <h6 className={styles.title}>
            {dict("user_variables")} <span>*These fields will be completed during user registration.</span>
          </h6>
          <InputDesign description='User name' target='text' name='name' value='' />
          <InputDesign description='User phone' target='text' name='phone' value='' />
        </div>
      </div>
      <div className={styles.button}>
        <Button title={dict("create")} />
      </div>
    </section>
  );
};

export default DesignForm;
