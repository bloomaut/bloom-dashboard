"use client";

import React from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Instagram, MessageCircle, Sparkles, Target, Calendar } from "lucide-react";
import { useEffect, useState } from "react";

interface StrategyLoadingProps {
  onComplete: () => void;
}

export function StrategyLoading({ onComplete }: StrategyLoadingProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      icon: <Instagram className='h-5 w-5 text-purple-600' />,
      text: "Analizando perfil de Instagram",
      duration: 1500,
    },
    {
      icon: <MessageCircle className='h-5 w-5 text-black' />,
      text: "Analizando perfil de TikTok",
      duration: 1500,
    },
    {
      icon: <Target className='h-5 w-5 text-blue-600' />,
      text: "Generando metas personalizadas",
      duration: 2000,
    },
    {
      icon: <Calendar className='h-5 w-5 text-green-600' />,
      text: "Creando cronograma automatizado",
      duration: 2000,
    },
    {
      icon: <Sparkles className='h-5 w-5 text-yellow-600' />,
      text: "Finalizando estrategias",
      duration: 1000,
    },
  ];

  useEffect(() => {
    let totalDuration = 0;
    const currentDuration = 0;

    // Calcular duración total
    steps.forEach(step => {
      totalDuration += step.duration;
    });

    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / totalDuration) * 50; // Actualizar cada 50ms

        // Determinar paso actual basado en el progreso
        let accumulatedDuration = 0;
        for (let i = 0; i < steps.length; i++) {
          accumulatedDuration += steps[i].duration;
          if ((newProgress / 100) * totalDuration <= accumulatedDuration) {
            setCurrentStep(i);
            break;
          }
        }

        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 500);
          return 100;
        }

        return newProgress;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className='flex-1 flex flex-col overflow-hidden'>
      {/* Header */}
      <header className='bg-white border-b border-gray-200 px-6 py-4'>
        <div className='flex items-center justify-between'>
          <h1 className='text-2xl font-bold text-gray-900'>Configuración de Redes Sociales</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className='flex-1 overflow-auto p-6 flex items-center justify-center'>
        <div className='max-w-2xl mx-auto w-full'>
          <Card className='border-2 border-blue-100'>
            <CardContent className='p-12 text-center space-y-8'>
              {/* Loading Animation */}
              <div className='relative'>
                <div className='w-24 h-24 mx-auto mb-6 relative'>
                  <div className='absolute inset-0 border-4 border-blue-100 rounded-full'></div>
                  <div className='absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin'></div>
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <Sparkles className='h-8 w-8 text-blue-600 animate-pulse' />
                  </div>
                </div>
              </div>

              {/* Main Message */}
              <div className='space-y-4'>
                <h2 className='text-3xl font-bold text-gray-900'>Estamos creando tus estrategias de redes sociales</h2>
                <p className='text-lg text-gray-600'>
                  Analizando tus perfiles y generando un plan personalizado para el éxito de tu negocio
                </p>
              </div>

              {/* Progress Bar */}
              <div className='space-y-4'>
                <Progress value={progress} className='h-3' />
                <p className='text-sm text-gray-500'>{Math.round(progress)}% completado</p>
              </div>

              {/* Current Step */}
              <div className='space-y-6'>
                <div className='flex items-center justify-center space-x-3 p-4 bg-blue-50 rounded-lg'>
                  {steps[currentStep]?.icon}
                  <span className='font-medium text-gray-900'>{steps[currentStep]?.text}</span>
                </div>

                {/* Steps List */}
                <div className='space-y-3'>
                  {steps.map((step, index) => (
                    <div
                      key={index}
                      className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                        index < currentStep
                          ? "bg-green-50 text-green-800"
                          : index === currentStep
                            ? "bg-blue-50 text-blue-800"
                            : "bg-gray-50 text-gray-500"
                      }`}
                    >
                      {index < currentStep ? (
                        <CheckCircle className='h-4 w-4 text-green-600' />
                      ) : (
                        <div className='w-4 h-4 flex items-center justify-center'>
                          {React.cloneElement(step.icon, {
                            className: `h-4 w-4 ${index === currentStep ? "animate-pulse" : "opacity-50"}`,
                          })}
                        </div>
                      )}
                      <span className='text-sm font-medium'>{step.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fun Facts */}
              <div className='pt-8 border-t border-gray-200'>
                <p className='text-sm text-gray-500 italic'>
                  💡 Sabías que las empresas que usan estrategias automatizadas aumentan su engagement en un 67%
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
