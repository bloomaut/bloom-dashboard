import Image from "next/image";
import styles from "./styles.module.scss";
import Icon from "@/components/Icon";
import { useTranslations } from "next-intl";

interface Props {
  name: string;
  description: string;
  price: number;
  image: string;
}

const TableRow = ({ name, description, price, image }: Props) => {
  const dict = useTranslations("dict.catalog");

  return (
    <div className={styles.container}>
      {image ? (
        <Image src={image} className={styles.imagen} alt={name} />
      ) : (
        <Icon
          name='dataset'
          width={70}
          height={30}
          viewBox={"0 0 84 54"}
          strokeColor={"#BEBEBE"}
          className='dataset_default'
        />
      )}
      <p className={`${styles.name} ${styles.box}`}>{name}</p>
      <p className={`${styles.description} ${styles.box}`}>{description}</p>
      <div className={`${styles.price_container} ${styles.box}`}>
        <p>{`${dict("price")}-$- ${price}`}</p>
      </div>
      <div className={`${styles.icons} ${styles.box}`}>
        <Icon name='edit' viewBox={"0 -2 30 30"} className='cursor_pointer' />
        <Icon name='delete' className='cursor_pointer' />
      </div>
    </div>
  );
};

export default TableRow;
