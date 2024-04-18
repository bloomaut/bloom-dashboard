import styles from "./styles.module.scss";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { useFlakeData } from "@/hooks/useFlakesUser";
import { useRouter } from "next/navigation";
import useFormValidator from "@/hooks/useFormValidator";

// Components
import Breadcrumb from "@/components/Breadcrumb";
import Input from "@/components/Input";
import Loading from "@/app/[locale]/(playground)/introduction/loading";
import Button from "@/components/Button";
import { post } from "@/services/fetch";
import { useMessageToast } from "@/hooks/useMessageToast";
import HogIcon from "../Playground/TemplatesSelector/Icons/Hog";
import PwaIcon from "../Hotlink/Select/Icon/Pwa";

const InitialEmptyImages = {
  sm_img: "",
  lg_img: "",
};

const InitialEmptyForm = {
  name: "",
  description: "",
  type_flake: "flake_power_apps",
  flake_id: "",
};

const NewCollectionPage = () => {
  const dict = useTranslations("dict.collections.new_collection");
  const router = useRouter();
  const { flakes, loading } = useFlakeData();
  const { notify, notifyError } = useMessageToast();
  const [images, setImages] = useState(InitialEmptyImages);
  const [form, setForm] = useState(InitialEmptyForm);
  const locale = useLocale();
  const [errors, setErrors] = useState<{ name?: string }>({});
  useEffect(() => {
    if (flakes.length > 0) {
      setImages({
        sm_img: flakes[0].hog_related?.thumbnail || "",
        lg_img: flakes[0]?.thumbnail || "",
      });

      setForm({
        ...form,
        name: "",
        description: flakes[0]?.skinx?.title || "",
        flake_id: flakes[0]?._id || "",
      });
    }
  }, [flakes]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });

    // Buscar el objeto correspondiente al diseño seleccionado
    const selectedFlake = flakes.find(flake => flake.skinx.title === value);

    // Actualizar las imágenes con el diseño seleccionado
    if (selectedFlake) {
      setImages({
        sm_img: selectedFlake.hog_related.thumbnail,
        lg_img: selectedFlake.thumbnail,
      });

      setForm({
        ...form,
        description: selectedFlake.skinx.title,
        flake_id: selectedFlake._id,
      });
    }
  };

  const handleBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.back();
  };

  const sendFlakeForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setErrors({ name: "El nombre es obligatorio" });
      return;
    }

    const response = await post("hotlink-collections", form);
    if (response.data.statusCode === 201) {
      notify(dict("colection_created"));
      router.replace(`/${locale}/collections`);
    } else {
      notifyError(dict("colection_error"));
    }
  };

  return (
    <section className={styles.new_collection}>
      <Breadcrumb title={dict("title")} />
      {!loading ? (
        <div className={styles.container}>
          <div className={styles.template}>
            <div className={images.sm_img ? styles.sm_img : `${styles.sm_img} ${styles.sm_not_img}`}>
              {images.sm_img ? <Image src={images.sm_img} alt={form.name} width={500} height={500} /> : <HogIcon />}
            </div>
            <div className={styles.lg_img}>
              {images.lg_img ? <Image src={images.lg_img} alt={form.name} width={800} height={800} /> : <PwaIcon />}
            </div>
          </div>

          <form className={styles.form} onSubmit={sendFlakeForm}>
            <Input
              type='text'
              textLabel={dict("input")}
              textHolder={dict("input")}
              name='name'
              value={form.name}
              handleChange={handleChange}
            />
            <p className={errors.name ? styles.error : styles.error_hidden}>{errors.name}</p>
            <div className={styles.select}>
              <label>{dict("select")}</label>
              <select name='description' value={form.description} onChange={handleChange}>
                {flakes.map(flake => (
                  <option key={flake._id} value={flake.skinx.title}>
                    {flake.skinx.title}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.buttons}>
              <button className={styles.cancel} onClick={handleBack}>
                {dict("cancel")}
              </button>
              <Button title={dict("generate_btn")} type='submit' />
            </div>
          </form>
        </div>
      ) : (
        <div className={styles.loader}>
          <Loading />
        </div>
      )}
    </section>
  );
};

export default NewCollectionPage;
