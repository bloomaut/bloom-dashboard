import { IconsProps } from "./interface";
import icons from "./icons";
import styles from "./styles.module.scss";

const Icon = ({ width, height, strokeColor, fillColor, strokeWidth, className, viewBox, name }: IconsProps) => {
  const paths = icons[name] || [];

  return (
    <svg
      className={className ? styles[className] : ""}
      width={width}
      height={height}
      viewBox={viewBox ?? "0 0 24 24"}
      fill={fillColor}
      stroke={strokeColor}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={strokeWidth ?? 1}
      fill-rule='evenodd'
      clip-rule='evenodd'
    >
      {paths.map((d, index) => (
        <path key={index} d={d} />
      ))}
    </svg>
  );
};
export default Icon;
