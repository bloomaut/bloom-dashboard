import styles from "./styles.module.scss";
import { useState } from "react";
import useStepValidation from "@/hooks/useStepValidation";
import { useCatalogContext } from "@/context/CatalogContext";
import { useRouter } from "@/navigation";
import { DatasetProps } from "@/typescript/interfaces/catalog.interface";
// Components
import Header from "./Header";
import Card from "./Card";
import LoadingSpinner from "@/components/Loading";
import Icon from "@/components/Icon";
import FormActions from "./FormActions";
import Button from "@/components/Button";
import { useTranslations } from "next-intl";

const Catalog = () => {
  const { datasets, fetchDatasets, loading } = useCatalogContext();
  const [showPopupCreate, setShowPopupCreate] = useState(false);
  const { step_03, step_04, currentStep } = useStepValidation();
  const router = useRouter();
  const dict = useTranslations("dict");

  const handleNavigation = () => {
    router.push("/my-powerapp");
  };

  const sumProducts = (array: DatasetProps[]) => {
    return array.reduce((sum: number, obj: DatasetProps) => {
      if (obj.hasOwnProperty("totalDataItems")) {
        return sum + obj.totalDataItems;
      }
      return sum;
    }, 0);
  };

  const numberOfProducts = sumProducts(datasets);

  return (
    <div className={styles.catalog_container}>
      <Header />
      <div className={styles.cards_container}>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <Card
              _id='1'
              createdAt='10'
              dataschema={datasets[0]?.dataschema || 0}
              description='All products'
              image=''
              name={dict("catalog.all_products")}
              order={1}
              totalDataItems={numberOfProducts}
              updatedAt='1'
              visibility
            />
            {datasets.length > 0 && datasets.map(dataset => <Card key={dataset._id} {...dataset} />)}
            <div className={styles.add} onClick={() => setShowPopupCreate(true)}>
              <Icon name='add' viewBox='0 0 20 22' width={50} height={50} strokeWidth={1.5} strokeColor='#282E7E' />
            </div>
          </>
        )}
        <div className={styles.btn_next}>
          {!step_04 && <Button title='Next' isDisabled={datasets.length === 0} onclick={handleNavigation} />}
        </div>
        {showPopupCreate && (
          <FormActions action='post' setShowConfirmation={setShowPopupCreate} fetchDatasets={fetchDatasets} />
        )}
      </div>
    </div>
  );
};

export default Catalog;
