"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  route: string;
}

interface TutorialContextType {
  steps: TutorialStep[];
  currentStep: number;
  isCompleted: boolean;
  completeStep: (stepId: string) => void;
  resetTutorial: () => void;
  getTutorialProgress: () => number;
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

const initialSteps: TutorialStep[] = [
  {
    id: "inventory",
    title: "Agregar primer producto",
    description: "Carga tu primer producto o servicio en el inventario",
    completed: false,
    route: "/inventory",
  },
  {
    id: "social-media",
    title: "Conectar redes sociales",
    description: "Conecta tu Instagram y TikTok",
    completed: false,
    route: "/social-media",
  },
  {
    id: "first-video",
    title: "Descargar Small App",
    description: "Descarga la app móvil para gestionar tu contenido",
    completed: false,
    route: "/social-media",
  },
];

export function TutorialProvider({ children }: { children: React.ReactNode }) {
  const [steps, setSteps] = useState<TutorialStep[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("tutorial-progress");
      return saved ? JSON.parse(saved) : initialSteps;
    }
    return initialSteps;
  });

  const currentStep = steps.findIndex(step => !step.completed);
  const isCompleted = steps.every(step => step.completed);

  useEffect(() => {
    localStorage.setItem("tutorial-progress", JSON.stringify(steps));
  }, [steps]);

  const completeStep = (stepId: string) => {
    setSteps(prev => prev.map(step => (step.id === stepId ? { ...step, completed: true } : step)));
  };

  const resetTutorial = () => {
    setSteps(initialSteps);
    localStorage.removeItem("tutorial-progress");
  };

  const getTutorialProgress = () => {
    const completedSteps = steps.filter(step => step.completed).length;
    return Math.round((completedSteps / steps.length) * 100);
  };

  return (
    <TutorialContext.Provider
      value={{
        steps,
        currentStep,
        isCompleted,
        completeStep,
        resetTutorial,
        getTutorialProgress,
      }}
    >
      {children}
    </TutorialContext.Provider>
  );
}

export function useTutorial() {
  const context = useContext(TutorialContext);
  if (context === undefined) {
    throw new Error("useTutorial must be used within a TutorialProvider");
  }
  return context;
}
