import styles from "./styles.module.scss";
import { useTranslations } from "next-intl";
import { useCatalogContext } from "@/context/CatalogContext";

interface Props {
  title: string;
  products: number;
  id: string;
  setShowModal: (value: React.SetStateAction<boolean>) => void;
}

const CatalogCard = ({ title, products, id, setShowModal }: Props) => {
  const { fetchDatasetById } = useCatalogContext();
  const dict = useTranslations("dict.business.my-powerapp");

  const handleClick = () => {
    fetchDatasetById(id);
    setShowModal(true);
  };

  return (
    <div className={styles.container} onClick={handleClick}>
      <p>
        {title}
        <span>
          ({products} {products === 1 ? dict("product") : dict("products")})
        </span>
      </p>
    </div>
  );
};

export default CatalogCard;
