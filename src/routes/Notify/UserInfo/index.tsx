import styles from "./styles.module.scss";

interface Props {
  name: string;
  hour: string;
}

const UserInfo = ({ name, hour }: Props) => {
  return (
    <div className={styles.info}>
      <span className={styles.name}>{name}</span>
      <span className={styles.hour}>{`${hour}hs`}</span>
    </div>
  );
};

export default UserInfo;
