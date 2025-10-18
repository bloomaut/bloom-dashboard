"use client";
import { useTranslations } from "next-intl";
import { X, ChevronRight } from "lucide-react";
import ItemTrack from "./ItemTrack";
import styles from "./styles.module.scss";
import { useAppSelector } from "@/store/hooks";
import { useEffect, useState } from "react";
import useStepValidation from "@/hooks/useStepValidation";
import { usePathname } from "next/navigation";

interface SideTrackProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

const SideTrack = ({ isOpen = false, onToggle }: SideTrackProps) => {
  const userData = useAppSelector(state => state.userData);
  const dict = useTranslations("dict.sidetrack");
  const [activeSideTrack, setActiveSideTrack] = useState<boolean>(false);
  const { step_01, step_02, currentStep } = useStepValidation();
  const path = usePathname();

  // Cuando el componente se monta, se chequea si completó el onboarding
  useEffect(() => {
    if (userData.id) {
      // TODOKEV: PONER EN TRUE PARA VER EL SIDETRACK !!!
      setActiveSideTrack(true); // Cambiado a true para mostrar el SideTrack
    }
  }, [userData]);

  // Data to render
  const data = [
    {
      position: 1,
      title: `${dict("step_1")}`,
      route: `/my-business`,
      iconName: "business_info",
      iconW: 22,
      iconH: 22,
      isActive: step_01,
      completed: step_01,
    },
    {
      position: 2,
      title: `${dict("step_2")}`,
      route: `/catalog`,
      isActive: step_02,
      iconName: "select_catalog",
      iconW: 20,
      iconH: 20,
      completed: step_02,
    },
  ];

  const currentStepData = data.find(i => path.includes(i.route)) || data[currentStep];
  const completedSteps = data.filter(step => step.completed).length;
  const totalSteps = data.length;
  const progressPercentage = (completedSteps / totalSteps) * 100;

  // Don't render if not active
  if (!activeSideTrack) return null;

  return (
    <>
      <section className={`${styles.sidetrack_container} ${isOpen ? styles.sidetrack_open : ""}`} id='sidetrack'>
        {/* Close button for mobile */}
        <button className={styles.close_button} onClick={onToggle} aria-label='Cerrar panel de progreso'>
          <X className='h-5 w-5' />
        </button>

        {/* Progress indicator */}
        <div className={styles.progress_indicator}>
          {completedSteps}/{totalSteps} completado
        </div>

        {/* Title section */}
        <div className={styles.title_container}>
          <h2 className={styles.title}>
            {dict("title")} {currentStepData?.position || currentStep + 1}
          </h2>
          <p className={styles.description}>{currentStepData?.title || dict("step_1")}</p>

          {/* Progress bar */}
          <div className='mt-4'>
            <div className='flex justify-between text-sm text-white/80 mb-2'>
              <span>Progreso</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div className='w-full bg-white/20 rounded-full h-2'>
              <div
                className='bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full transition-all duration-500 ease-out'
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Steps container */}
        <div className={styles.steps_container}>
          {data.map((step, index) => {
            return (
              <ItemTrack
                key={step.title}
                title={step.title}
                route={step.route}
                iconH={step.iconH}
                iconW={step.iconW}
                iconName={step.iconName}
                isActive={step.isActive}
                completed={step.completed}
                stepNumber={step.position}
                isLoading={false} // You can add loading logic here
              />
            );
          })}
        </div>

        {/* Next step suggestion */}
        {completedSteps < totalSteps && (
          <div className='mt-auto pt-6 border-t border-white/20'>
            <div className='bg-white/10 rounded-lg p-4 backdrop-blur-sm'>
              <div className='flex items-center justify-between'>
                <div>
                  <h4 className='font-medium text-white mb-1'>Siguiente paso</h4>
                  <p className='text-sm text-white/80'>{data.find(step => !step.completed)?.title || "¡Completado!"}</p>
                </div>
                <ChevronRight className='h-5 w-5 text-white/60' />
              </div>
            </div>
          </div>
        )}

        {/* Completion celebration */}
        {completedSteps === totalSteps && (
          <div className='mt-auto pt-6 border-t border-white/20'>
            <div className='bg-gradient-to-r from-green-500/20 to-green-400/20 rounded-lg p-4 backdrop-blur-sm border border-green-400/30'>
              <div className='text-center'>
                <div className='text-2xl mb-2'>🎉</div>
                <h4 className='font-medium text-white mb-1'>¡Felicitaciones!</h4>
                <p className='text-sm text-white/80'>Has completado todos los pasos de configuración</p>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default SideTrack;
