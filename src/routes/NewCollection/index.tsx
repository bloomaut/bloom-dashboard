import styles from "./styles.module.scss";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useFlakeData } from "@/hooks/useFlakesUser";
import { useRouter } from "next/navigation";
// Components
import Breadcrumb from "@/components/Breadcrumb";
import Input from "@/components/Input";
import Loading from "@/app/[locale]/(playground)/introduction/loading";
import Button from "@/components/Button";

const InitialEmptyImages = {
  sm_img: "",
  lg_img: "",
};

const InitialEmptyForm = {
  name: "",
  design: "",
};

const NewCollectionPage = () => {
  const dict = useTranslations("dict.collections.new_collection");
  const router = useRouter();
  const { flakes, loading } = useFlakeData();
  const [images, setImages] = useState(InitialEmptyImages);
  const [form, setForm] = useState(InitialEmptyForm);

  useEffect(() => {
    if (flakes.length > 0) {
      setImages({
        sm_img: flakes[0].hog_related.thumbnail,
        lg_img: flakes[0].thumbnail,
      });

      setForm({
        name: flakes[0].skinx.title,
        design: flakes[0].skinx.title,
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
        name: selectedFlake.skinx.title,
        design: selectedFlake.skinx.title,
      });
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <section className={styles.new_collection}>
      <Breadcrumb title={dict("title")} />
      {!loading ? (
        <div className={styles.container}>
          <div className={styles.template}>
            <div className={styles.sm_img}>
              <Image src={images.sm_img} alt={form.name} width={100} height={100} />
            </div>
            <div className={styles.lg_img}>
              <Image src={images.lg_img} alt={form.name} width={100} height={100} />
            </div>
          </div>
          <form className={styles.form}>
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
              <select name='design' value={form.design} onChange={handleChange}>
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
