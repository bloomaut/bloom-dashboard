import { useRouter } from "@/navigation";
import { CheckCircle, Clock, Loader2 } from "lucide-react";
import styles from "./styles.module.scss";
import Icon from "@/components/Icon";

interface ItemTrackProps {
  title: string;
  route: string;
  isActive: boolean;
  completed?: boolean;
  isLoading?: boolean;
  stepNumber?: number;
  iconName: string;
  iconW: number;
  iconH: number;
}

const ItemTrack = ({
  title,
  route,
  isActive,
  completed = false,
  isLoading = false,
  stepNumber,
  iconName,
  iconW,
  iconH,
}: ItemTrackProps) => {
  const router = useRouter();

  const handleClick = () => {
    if (isActive && !isLoading) {
      router.push(route);
    }
  };

  const getButtonClass = () => {
    if (isLoading) return `${styles.button} ${styles.loading}`;
    if (completed) return `${styles.button} ${styles.completed}`;
    if (isActive) return `${styles.button} ${styles.active}`;
    return `${styles.button} ${styles.inactive}`;
  };

  const getCircleClass = () => {
    if (completed) return styles.circle;
    return styles.circle_inactive;
  };

  const getSpanClass = () => {
    if (completed || isActive) return styles.span_active;
    return styles.span_inactive;
  };

  const renderIcon = () => {
    if (isLoading) {
      return <Loader2 className='h-4 w-4 animate-spin' />;
    }

    if (completed) {
      return <CheckCircle className='h-4 w-4' />;
    }

    return (
      <Icon
        name={iconName}
        width={iconW}
        height={iconH}
        viewBox={`0 0 ${iconW} ${iconH}`}
        fillColor={completed || isActive ? "#fff" : "#7f7f7f"}
        strokeColor='none'
      />
    );
  };

  const renderStatusIndicator = () => {
    if (completed) {
      return <div className={styles.checkmark} />;
    }

    if (stepNumber && !completed) {
      return <div className={styles.step_number}>{stepNumber}</div>;
    }

    return null;
  };

  return (
    <button
      className={getButtonClass()}
      onClick={handleClick}
      disabled={!isActive || isLoading}
      aria-label={`${title} - ${completed ? "Completado" : isActive ? "Disponible" : "Bloqueado"}`}
    >
      <div className='flex items-center space-x-3 flex-1'>
        <div className='relative'>
          <div className={getCircleClass()}>{renderIcon()}</div>
          {renderStatusIndicator()}
        </div>

        <div className='flex-1 text-left'>
          <span className='block font-medium'>{title}</span>
          {isLoading && <span className='text-xs text-white/70 block mt-1'>Cargando...</span>}
          {completed && <span className='text-xs text-white/70 block mt-1'>✓ Completado</span>}
          {!isActive && !completed && <span className='text-xs text-white/50 block mt-1'>Bloqueado</span>}
        </div>
      </div>

      {/* Status indicator line */}
      <span className={getSpanClass()}></span>

      {/* Progress indicator for active step */}
      {isActive && !completed && (
        <div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
          <Clock className='h-4 w-4 text-white/60' />
        </div>
      )}
    </button>
  );
};

export default ItemTrack;
