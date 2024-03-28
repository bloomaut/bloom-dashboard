import { useTranslations } from "next-intl";
import styles from "./styles.module.scss";
import Breadcrumb from "@/components/Breadcrumb";
import Input from "@/components/Input";
import { useEffect, useState } from "react";
import { useFlakeData } from "@/hooks/useFlakesUser";
import Loading from "@/app/[locale]/(playground)/introduction/loading";
import Image from "next/image";
import { Powerapp } from "@/typescript/interfaces/flakes.interface";

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
  const { flakes, loading } = useFlakeData();
  const [images, setImages] = useState(InitialEmptyImages);
  const [form, setForm] = useState(InitialEmptyForm);
  const [flakeSelected, setFlakeSelected] = useState<Powerapp>();

  useEffect(() => {
    if (flakes.length > 0) {
      setImages({
        sm_img: flakes[0].hog_related.thumbnail,
        lg_img: flakes[0].thumbnail,
      });

      setForm({
        ...form,
        design: flakes[0].skinx.title,
      });

      setFlakeSelected(flakes[0]);
    }
  }, [flakes]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });

    // Buscar el objeto correspondiente al diseño seleccionado
    const selectedFlake = flakes.find(flake => flake.skinx.title === value);
    setFlakeSelected(selectedFlake);

    // Actualizar las imágenes con el diseño seleccionado
    if (selectedFlake) {
      setImages({
        sm_img: selectedFlake.hog_related.thumbnail,
        lg_img: selectedFlake.thumbnail,
      });
    }
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
              <select name='design' value={form.design} onChange={handleChange}>
                {flakes.map(flake => (
                  <option key={flake._id} value={flake.skinx.title}>
                    {flake.skinx.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
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
