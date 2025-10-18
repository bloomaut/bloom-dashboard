import { useRouter } from "@/navigation";
import styles from "./styles.module.scss";
import Icon from "@/components/Icon";

interface ItemTrackProps {
  title: string;
  route: string;
  isActive: boolean;
  iconName: string;
  iconW: number;
  iconH: number;
}

const ItemTrack = ({ title, route, isActive, iconName, iconW, iconH }: ItemTrackProps) => {
  const router = useRouter();

  const handleClick = () => {
    if (isActive) {
      router.push(route);
    }
  };

  return (
    <button className={styles.button} onClick={handleClick}>
      {title}
      <div className={isActive ? styles.circle : styles.circle_inactive}>
        <Icon
          name={iconName}
          width={iconW}
          height={iconH}
          viewBox={`0 0 ${iconW} ${iconH}`}
          fillColor={isActive ? "#fff" : "#7f7f7f"}
          strokeColor='none'
        />
      </div>
      <span className={isActive ? styles.span_active : styles.span_inactive}></span>
    </button>
  );
};

export default ItemTrack;
