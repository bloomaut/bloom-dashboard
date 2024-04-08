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
import { post } from "@/services/fetch";
import { ENV } from "@/typescript/types/environment.enum";
import { useMessageToast } from "@/hooks/useMessageToast";

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

  useEffect(() => {
    if (flakes.length > 0) {
      setImages({
        sm_img: flakes[0].hog_related?.thumbnail || "",
        lg_img: flakes[0]?.thumbnail || "",
      });

      setForm({
        ...form,
        name: flakes[0]?.skinx?.title || "",
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

    const response = await post("hotlink-collections", form, ENV.DASH);
    if (response.data.statusCode === 201) {
      notify(dict("colection_created"));
    } else {
      notifyError(dict("colection_error"));
    }
  };

  return (
    <section className={styles.new_collection}>
      <Breadcrumb title={dict("title")} />
      {!loading ? (
        <div className={styles.container}>
          {images.sm_img && images.lg_img ? (
            <div className={styles.template}>
              <div className={styles.sm_img}>
                <Image src={images.sm_img} alt={form.name} width={100} height={100} />
              </div>
              <div className={styles.lg_img}>
                <Image src={images.lg_img} alt={form.name} width={100} height={100} />
              </div>
            </div>
          ) : (
            <div>Cargando imágenes...</div>
          )}
          <form className={styles.form} onSubmit={sendFlakeForm}>
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
