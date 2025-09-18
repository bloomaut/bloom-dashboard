"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowRight, Package, Share2, Smartphone } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTutorial } from "@/context/TutorialContext";

export function TutorialStepper() {
  const { steps, currentStep, getTutorialProgress, isCompleted } = useTutorial();
  const router = useRouter();

  if (isCompleted) {
    return null;
  }

  const progress = getTutorialProgress();
  const activeStep = steps[currentStep];

  const getStepIcon = (stepId: string) => {
    switch (stepId) {
      case "inventory":
        return <Package className='h-3 w-3 sm:h-4 sm:w-4' />;
      case "social-media":
        return <Share2 className='h-3 w-3 sm:h-4 sm:w-4' />;
      case "first-video":
        return <Smartphone className='h-3 w-3 sm:h-4 sm:w-4' />;
      default:
        return null;
    }
  };

  const handleGoToStep = () => {
    if (activeStep) {
      router.push(activeStep.route);
    }
  };

  return (
    <Card className='border-blue-200 bg-blue-50'>
      <CardHeader className='pb-2 sm:pb-3'>
        {/* Header mejorado para responsive */}
        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <div className='text-xs sm:text-sm font-medium text-blue-800 truncate'>Configuración inicial</div>
            <Badge
              variant='outline'
              style={{
                fontSize: "0.75rem",
                color: "#1D4ED8", // text-blue-700
                borderColor: "#93C5FD", // border-blue-300
                padding: "0.125rem 0.375rem",
                marginLeft: "0.5rem",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "0.25rem",
                lineHeight: 1,
              }}
            >
              {progress}%
            </Badge>
          </div>
          <Progress value={progress} className='h-1.5 sm:h-2' />
        </div>
      </CardHeader>
      <CardContent className='space-y-2 sm:space-y-3 pt-0'>
        {/* Lista de pasos mejorada */}
        <div className='space-y-1.5 sm:space-y-2'>
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center space-x-2 sm:space-x-3 p-1.5 sm:p-2 rounded-lg transition-colors ${
                step.completed
                  ? "bg-green-50 text-green-800"
                  : index === currentStep
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-50 text-gray-600"
              }`}
            >
              <div className='flex-shrink-0'>
                {step.completed ? (
                  <CheckCircle className='h-3 w-3 sm:h-4 sm:w-4 text-green-600' />
                ) : (
                  <div className='w-3 h-3 sm:w-4 sm:h-4 flex items-center justify-center'>{getStepIcon(step.id)}</div>
                )}
              </div>
              <div className='flex-1 min-w-0'>
                <div className='text-xs font-medium truncate leading-tight'>{step.title}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Paso actual mejorado */}
        {activeStep && (
          <div className='pt-2 sm:pt-3 border-t border-blue-200'>
            <div className='space-y-2'>
              <div className='text-xs font-medium text-blue-800'>Siguiente paso:</div>
              <div className='text-xs text-blue-700 leading-relaxed'>{activeStep.description}</div>
              <Button
                size='sm'
                className='w-full bg-blue-600 hover:bg-blue-700 text-white text-xs py-1.5 sm:py-2 cursor-pointer'
                onClick={handleGoToStep}
              >
                <div className='truncate'>Continuar</div>
                <ArrowRight className='h-3 w-3 ml-1 flex-shrink-0' />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
