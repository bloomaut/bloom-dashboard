"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTutorial } from "@/context/TutorialContext";
import { Smartphone, Download } from "lucide-react";

export function AppDownload() {
  const { completeStep } = useTutorial();

  const handleDownload = (platform: "android" | "ios") => {
    // Simular descarga
    console.log(`Descargando app para ${platform}`);

    // Completar el paso del tutorial
    completeStep("first-video");

    // En una implementación real, aquí redirigiríamos a la store correspondiente
    if (platform === "android") {
      // window.open("https://play.google.com/store/apps/details?id=com.small.app", "_blank")
    } else {
      // window.open("https://apps.apple.com/app/small-app/id123456789", "_blank")
    }
  };

  return (
    <Card className='border-purple-200 bg-purple-50'>
      <CardHeader>
        <CardTitle className='flex items-center space-x-2 text-purple-800'>
          <Smartphone className='h-5 w-5' />
          <span>Small App</span>
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <p className='text-sm text-purple-700'>
          Descarga nuestra app móvil para gestionar tu contenido desde cualquier lugar
        </p>

        <div className='space-y-3'>
          <Button
            className='w-full bg-green-600 hover:bg-green-700 text-white'
            onClick={() => handleDownload("android")}
          >
            <Download className='h-4 w-4 mr-2' />
            Descargar para Android
          </Button>

          <Button className='w-full bg-gray-800 hover:bg-gray-900 text-white' onClick={() => handleDownload("ios")}>
            <Download className='h-4 w-4 mr-2' />
            Descargar para iOS
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
