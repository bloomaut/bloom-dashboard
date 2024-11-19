import styles from "./styles.module.scss";
import whiteImage from "@/../public/assets/blank.png";
import { useState } from "react";
import { useCatalogContext } from "@/context/CatalogContext";
import { useTranslations } from "next-intl";
import { DatasetProps } from "@/typescript/interfaces/catalog.interface";
// Components
import Header from "./Header";
import Card from "./Card";
import LoadingSpinner from "@/components/Loading";
import Icon from "@/components/Icon";
import FormActions from "./FormActions";
import CardAll from "./CardAll";

const Catalog = () => {
  const { datasets, loading } = useCatalogContext();
  const [showPopupCreate, setShowPopupCreate] = useState(false);
  const dict = useTranslations("dict");

  const sumCategories = (array: DatasetProps[], category: string) => {
    const newArray = array.filter((obj: DatasetProps) => obj.dataschema?.category === category);
    return newArray.reduce((sum: number, obj: DatasetProps) => {
      if (obj.hasOwnProperty("totalDataItems")) {
        return sum + obj.totalDataItems;
      }
      return sum;
    }, 0);
  };

  const numberOfProducts = sumCategories(datasets, "uitool-products");
  const numberOfServices = sumCategories(datasets, "uitool-services");
  const numberOfStore = sumCategories(datasets, "uitool-store");

  return (
    <div className={styles.catalog_container}>
      <Header />
      <div className={styles.cards_container}>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className={styles.products_services}>
              <CardAll
                dataschema='uitool-products'
                name={dict("catalog.all_products")}
                totalDataItems={numberOfProducts}
                image={whiteImage}
              />
              <CardAll
                dataschema='uitool-services'
                name={dict("catalog.all_services")}
                totalDataItems={numberOfServices}
                image={whiteImage}
              />
              <CardAll
                dataschema='uitool-store'
                name={dict("catalog.all_services")}
                totalDataItems={numberOfStore}
                image={whiteImage}
              />
            </div>
            {datasets.length > 0 && datasets.map(dataset => <Card key={dataset._id} {...dataset} />)}
            <div className={styles.add} onClick={() => setShowPopupCreate(true)}>
              <Icon name='add' viewBox='0 0 20 22' width={50} height={50} strokeWidth={1.5} strokeColor='#282E7E' />
            </div>
          </>
        )}
        {showPopupCreate && <FormActions action='post' setShowConfirmation={setShowPopupCreate} />}
      </div>
    </div>
  );
};

export default Catalog;
