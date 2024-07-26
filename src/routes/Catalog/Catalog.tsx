import styles from "./styles.module.scss";
import { useTranslations } from "next-intl";
import { useState } from "react";
import useStepValidation from "@/hooks/useStepValidation";
import { useCatalogContext } from "@/context/CatalogContext";
import { useRouter } from "@/navigation";
// Components
import Header from "./Header";
import Card from "./Card";
import LoadingSpinner from "@/components/Loading";
import Icon from "@/components/Icon";
import FormActions from "./FormActions";
import Button from "@/components/Button";

const Catalog = () => {
  const { datasets, fetchDatasets, loading } = useCatalogContext();
  const [showPopupCreate, setShowPopupCreate] = useState(false);
  const { step_03, step_04 } = useStepValidation();
  const router = useRouter();
  const dict = useTranslations("dict");

  const handleNavigation = () => {
    router.push("/my-powerapp");
  };

  return (
    <div className={styles.catalog_container}>
      <Header />
      <div className={styles.cards_container}>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {datasets.length > 0 && datasets.map(dataset => <Card key={dataset._id} {...dataset} />)}
            <div className={styles.add} onClick={() => setShowPopupCreate(true)}>
              <Icon name='add' viewBox='0 0 20 22' width={50} height={50} strokeWidth={1.5} strokeColor='#282E7E' />
            </div>
          </>
        )}
        <div className={styles.btn_next}>
          {!step_04 && <Button title='Next' isDisabled={step_03} onclick={handleNavigation} />}
        </div>
        {showPopupCreate && (
          <FormActions action='post' setShowConfirmation={setShowPopupCreate} fetchDatasets={fetchDatasets} />
        )}
      </div>
    </div>
  );
};

export default Catalog;
