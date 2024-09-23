import { useDesignContext } from "@/context/DesignContext";
import styles from "./styles.module.scss";
import Image from "next/image";
import InputDesign from "../InputDesign";
import Button from "@/components/Button";
import { get, post, update } from "@/services/fetch";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { DesignProps, VariablesFormDesign } from "@/typescript/interfaces/designs.interface";
import { useMessageToast } from "@/hooks/useMessageToast";
import { handleFileUpload } from "@/utils/handleFileUpload";
import { useParams, useRouter } from "next/navigation";
import PopupDesign from "../PopupDesign";
import useFormValidator from "@/hooks/useFormValidator";

type FormValues = {
  title: string;
  description: string;
  variables: VariablesFormDesign[];
  pwa_id: string;
  flake_id: string;
  type_design: string;
};

const DesignForm = () => {
  const { listTemplates, designSelected } = useDesignContext();

  const initialValues: FormValues = {
    title: "",
    description: "",
    variables:
      designSelected?.variables.map(field => ({
        key: field.name,
        name: field.name,
        description: field.description,
        value: field.value || "",
        target: field.target,
      })) || [],
    pwa_id: designSelected?.powerapp._id || "",
    flake_id: designSelected?.flake._id || "",
    type_design: designSelected?.type_design || "",
  };

  const [loading, setLoading] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [formValues, setFormValues] = useState<FormValues>(initialValues);
  const [activePopup, setActivePopup] = useState<boolean>(false);
  const [popupData, setPopupData] = useState<any>(null);
  const [checkValidation, setCheckValidation] = useState<boolean>(false);
  const { notify, notifyError } = useMessageToast();
  const dict = useTranslations("dict");
  const params = useParams();
  const router = useRouter();
  const locale = useLocale();

  const fieldsToValidate = [
    "title",
    "description",
    ...formValues.variables.map((field: VariablesFormDesign) => field.name),
  ];
  const errors = useFormValidator(formValues, fieldsToValidate, file, "designs");

  const handleInputChange = (name: string, value: string) => {
    if (name === "title" || name === "description") {
      setFormValues(prevValues => ({
        ...prevValues,
        [name]: value,
      }));
    } else {
      setFormValues(prevValues => ({
        ...prevValues,
        variables: prevValues.variables.map(variable => (variable.name === name ? { ...variable, value } : variable)),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckValidation(true);
    setLoading(true);

    let imageUrl: string | null = null;
    const isUpdate = designExist;

    if (Object.keys(errors).length === 0) {
      if (isUpdate) {
        const dataToSend = {
          title: formValues.title,
          description: formValues.description,
          variables: formValues.variables.map(variable => ({
            key: variable.key,
            name: variable.name,
            description: variable.description,
            target: variable.target,
            value: variable.target === "image" ? imageUrl || "" : variable.value,
          })),
          pwa_id: designSelected?.powerapp._id || "",
        };
        const updatedData = await update(`design-small/${params.id}`, dataToSend);
        if (updatedData.statusCode === 200) {
          notify("Diseño actualizado correctamente");
          setPopupData(updatedData.result.design);
          setActivePopup(true);
        } else {
          notifyError(dict("toast.error_design"));
        }
      } else {
        if (file) {
          try {
            imageUrl = await handleFileUpload(file);
            if (!imageUrl) {
              throw new Error("File upload failed");
            }
          } catch (error) {
            notifyError("Error uploading file: " + error);
            setLoading(false);
            return;
          }
        }

        const payload = {
          title: formValues.title,
          description: formValues.description,
          variables: formValues.variables.map(variable => ({
            key: variable.key,
            name: variable.name,
            description: variable.description,
            target: variable.target,
            value: variable.target === "image" ? imageUrl || "" : variable.value,
          })),
          pwa_id: designSelected?.powerapp._id || "",
          flake_id: designSelected?.flake._id || "",
          type_design: designSelected?.type_design || "",
        };

        const response = await post("design-small/create", payload);
        if (response.data.statusCode === 201) {
          notify(dict("toast.success_design"));
          setPopupData(response.data.result.design);
          setActivePopup(true);
        } else {
          notifyError(dict("toast.error_design"));
        }
      }
    }

    setLoading(false);
  };

  const designExist = listTemplates && listTemplates.designs.some(design => design._id === params.id);

  const getDesign = async () => {
    if (designExist) {
      const response = await get(`design-small/${params.id}`);
      if (response.statusCode === 200 && response.result.design) {
        const design: DesignProps = response.result.design;
        setFormValues({
          title: design.title || "",
          description: design.description || "",
          variables: design.variables.map((field: any) => ({
            key: field.name,
            name: field.name,
            description: field.description,
            value: field.value || "",
            target: field.target,
          })),
          pwa_id: designSelected?.powerapp._id || "",
          flake_id: designSelected?.flake._id || "",
          type_design: designSelected?.type_design || "",
        });
      }
    }
  };

  useEffect(() => {
    getDesign();
  }, []);

  useEffect(() => {
    if (checkValidation && Object.keys(errors).length === 0) {
      setCheckValidation(false);
    }
  }, [errors]);

  const ErrorMessage = ({ error }: { error: string | undefined }) => (
    <p className={error ? styles.error : styles.error_hidden}>{error}</p>
  );

  return (
    <section className={styles.step_two}>
      <div className={styles.design_preview}>
        <h4 className={styles.img_title}>{dict("designs.create_design.title")}</h4>
        <div className={styles.img_container}>
          <Image
            src={designSelected?.flake.thumbnail || ""}
            alt={designSelected?.flake.title || ""}
            width={500}
            height={500}
          />
        </div>
        <div className={styles.img_form}>
          <div className={styles.form_control}>
            <InputDesign
              description={dict("designs.create_design.input_title")}
              target='text'
              name='title'
              value={formValues.title || ""}
              onChange={handleInputChange}
            />
            {checkValidation && <ErrorMessage error={errors.title} />}
          </div>
          <div className={styles.form_control}>
            <InputDesign
              description={dict("designs.create_design.input_description")}
              target='text'
              name='description'
              value={formValues.description || ""}
              onChange={handleInputChange}
            />
            {checkValidation && <ErrorMessage error={errors.description} />}
          </div>
          <div className={styles.pwa_text}>
            <p className={styles.pwa}>{dict("designs.create_design.pwa_diffusion")}</p>
            <p className={styles.name}>{designSelected?.powerapp.title}</p>
          </div>
        </div>
      </div>
      <div className={styles.design_form}>
        <h3 className={styles.title}>
          <span>{designSelected?.type_design}:</span> {designSelected?.flake.title || ""}
        </h3>
        <div className={styles.form_container}>
          <p className={styles.field}>{dict("designs.create_design.fields")}</p>
          <form onSubmit={handleSubmit}>
            <div className={styles.input_grid}>
              {formValues.variables
                .filter(variable => !variable.name.startsWith("Client"))
                .map((variable, index) => (
                  <div className={styles.form_control} key={index}>
                    <InputDesign
                      description={variable.description}
                      target={variable.target}
                      name={variable.name}
                      value={variable.value}
                      onChange={(name, value) => handleInputChange(name, value)}
                      file={file}
                      setFile={variable.target === "image" ? setFile : undefined}
                    />
                    {checkValidation && <ErrorMessage error={errors[variable.name]} />}
                  </div>
                ))}
            </div>
          </form>
          {formValues.variables.filter(variable => !variable.name.startsWith("Client")).length === 0 && (
            <p className={styles.no_variables_message}>{dict("designs.create_design.empty_variables")}</p>
          )}
        </div>

        <div className={styles.user_variables}>
          <h6 className={styles.title}>
            {dict("designs.create_design.user_variables")}{" "}
            <span>*{dict("designs.create_design.user_variables_message")}.</span>
          </h6>
          {formValues.variables.filter(variable => variable.name.startsWith("Client")).length === 0 ? (
            <p className={styles.no_variables_message}>{dict("designs.create_design.empty_variables")}</p>
          ) : (
            formValues.variables
              .filter(variable => variable.name.startsWith("Client"))
              .map((variable, index) => (
                <InputDesign
                  key={index}
                  description={variable.description}
                  target={variable.target}
                  name={variable.name}
                  value={variable.value}
                  disabled={true}
                  onChange={handleInputChange}
                />
              ))
          )}
        </div>
      </div>
      <div className={styles.button} onClick={handleSubmit}>
        <Button
          title={designExist ? dict("designs.create_design.edit") : dict("designs.create_design.create")}
          loading={loading}
        />
      </div>
      {activePopup && (
        <PopupDesign
          onCancel={() => router.push(`/${locale}/designs`)}
          setShowConfirmation={setActivePopup}
          thumbnail={designSelected?.flake.thumbnail || ""}
          title={popupData.title || ""}
          description={popupData.description || ""}
          typeDesign={popupData.type_design || null}
          hog={popupData.hog.title || ""}
          pwa={popupData.power_app.title || ""}
          url={`${process.env.NEXT_PUBLIC_ENGINE_URL}/c/${popupData._id}`}
          loading={loading}
          fields={popupData.variables || []}
        />
      )}
    </section>
  );
};

export default DesignForm;
