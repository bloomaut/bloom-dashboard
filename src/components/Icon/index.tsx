import { IconsProps } from "./interface";
import icons from "./icons";
import styles from "./styles.module.scss";

const Icon = ({ width, height, strokeColor, fillColor, strokeWidth, className, viewBox, name }: IconsProps) => {
  const paths = icons[name] || [];

  return (
    <svg
      className={className ? `${styles[name]} ${styles[className]}` : `${styles[name]}`}
      width={width ?? 20}
      height={height ?? 20}
      viewBox={viewBox ?? "0 0 30 30"}
      fill={fillColor ?? "none"}
      stroke={strokeColor ?? "#381d2a"}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={strokeWidth ?? 2}
      fillRule='evenodd'
      clipRule='evenodd'
    >
      {paths.map((d, index) => (
        <path key={index} d={d} />
      ))}
    </svg>
  );
};
export default Icon;
