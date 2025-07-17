"use client";

import { SectionBlocked } from "@/components/v0Components/SectionBlocked";
import { useTutorial } from "@/context/TutorialContext";
import { FinancesDashboard } from "@/components/v0Components/FinancesDashboard";

export default function FinancesPage() {
  const { isCompleted } = useTutorial();

  return (
    <div className='flex h-screen bg-gray-50 w-full'>
      {true ? (
        <FinancesDashboard />
      ) : (
        <SectionBlocked
          title='Finanzas'
          description='El módulo de finanzas estará disponible una vez que completes la configuración inicial de tu cuenta.'
        />
      )}
    </div>
  );
}
