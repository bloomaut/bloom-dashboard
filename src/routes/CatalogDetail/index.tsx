import styles from "./styles.module.scss";
import { useParams } from "next/navigation";

const CatalogDetail = () => {
  const { id } = useParams();

  return <div>Catalog Detail</div>;
};

export default CatalogDetail;
