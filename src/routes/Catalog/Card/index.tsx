import Button from "@/components/Button";
import styles from "./styles.module.scss";
import { DatasetProps } from "@/typescript/interfaces/catalog.interface";
import Icon from "@/components/Icon";

const Card = ({ name }: DatasetProps) => {
  return (
    <div className={styles.card}>
      <h1 className={styles.name}>{name}</h1>
      <div className={styles.btn_container}>
        <Button
          title=''
          styleName='btn_square'
          icon={<Icon name='edit' width={20} height={20} strokeColor='#fff' viewBox='0 0 20 23' />}
        />
        <Button
          title=''
          styleName='btn_square'
          icon={<Icon name='delete' width={20} height={20} strokeColor='#fff' viewBox='0 0 23 22' />}
        />
      </div>
    </div>
  );
};

export default Card;
