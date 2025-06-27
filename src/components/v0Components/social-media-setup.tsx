"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Instagram, MessageCircle, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { useTutorial } from "@/context/TutorialContext"

interface SocialMediaSetupProps {
  connectedAccounts: {
    instagram: boolean
    tiktok: boolean
  }
  onAccountConnection: (platform: "instagram" | "tiktok") => void
}

export function SocialMediaSetup({ connectedAccounts, onAccountConnection }: SocialMediaSetupProps) {
  const { completeStep } = useTutorial()
  const [connecting, setConnecting] = useState<string | null>(null)

  const handleConnect = async (platform: "instagram" | "tiktok") => {
    setConnecting(platform)

    // Simular proceso de conexión
    await new Promise((resolve) => setTimeout(resolve, 2000))

    onAccountConnection(platform)
    setConnecting(null)

    // Verificar si ambas cuentas están conectadas después de esta conexión
    const newConnectedAccounts = {
      ...connectedAccounts,
      [platform]: true,
    }

    if (newConnectedAccounts.instagram && newConnectedAccounts.tiktok) {
      completeStep("social-media") // Completar el paso del tutorial
    }
  }

  const getStatusBadge = (platform: "instagram" | "tiktok") => {
    if (connectedAccounts[platform]) {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          Conectado
        </Badge>
      )
    }

    if (connecting === platform) {
      return (
        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
          <Clock className="h-3 w-3 mr-1" />
          Conectando...
        </Badge>
      )
    }

    return (
      <Badge className="bg-gray-100 text-gray-600 border-gray-200">
        <AlertCircle className="h-3 w-3 mr-1" />
        No conectado
      </Badge>
    )
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Configuración de Redes Sociales</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto">
          {/* Instructions Card */}
          <Card className="mb-8 border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="text-orange-800">Instrucciones</CardTitle>
              <CardDescription className="text-orange-700">
                Página inicial donde primero tienes que registrar tus cuentas de Instagram y TikTok
              </CardDescription>
            </CardHeader>
            <CardContent className="text-orange-700">
              <p className="mb-2">Deberían haber dos botones uno para IG, otro para TikTok.</p>
              <p className="mb-2">Y alguna UI que indique el estatus de registro.</p>
              <p>Si ya se registró una cuenta envíos verde completado, si todavía no se hizo nada con otro color.</p>
            </CardContent>
          </Card>

          {/* Warning Message */}
          {(connectedAccounts.instagram || connectedAccounts.tiktok) &&
            !(connectedAccounts.instagram && connectedAccounts.tiktok) && (
              <Card className="mb-6 border-yellow-200 bg-yellow-50">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="font-medium text-yellow-800">¡Casi listo!</p>
                      <p className="text-sm text-yellow-700">
                        Necesitas conectar ambas cuentas (Instagram y TikTok) para acceder al dashboard completo.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

          {/* Setup Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Instagram Setup */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
                  <Instagram className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">Instagram</CardTitle>
                <CardDescription>Conecta tu cuenta de Instagram para gestionar tus publicaciones</CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                {getStatusBadge("instagram")}

                <div className="space-y-2">
                  <p className="text-sm text-gray-600">• Programar publicaciones</p>
                  <p className="text-sm text-gray-600">• Ver métricas de engagement</p>
                  <p className="text-sm text-gray-600">• Gestionar stories</p>
                </div>

                <Button
                  onClick={() => handleConnect("instagram")}
                  disabled={connectedAccounts.instagram || connecting === "instagram"}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  {connecting === "instagram" ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Conectando...
                    </>
                  ) : connectedAccounts.instagram ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Conectado
                    </>
                  ) : (
                    <>
                      <Instagram className="h-4 w-4 mr-2" />
                      Conectar Instagram
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* TikTok Setup */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-black rounded-full flex items-center justify-center mb-4">
                  <MessageCircle className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">TikTok</CardTitle>
                <CardDescription>Conecta tu cuenta de TikTok para gestionar tu contenido</CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                {getStatusBadge("tiktok")}

                <div className="space-y-2">
                  <p className="text-sm text-gray-600">• Subir videos automáticamente</p>
                  <p className="text-sm text-gray-600">• Analizar rendimiento</p>
                  <p className="text-sm text-gray-600">• Programar contenido</p>
                </div>

                <Button
                  onClick={() => handleConnect("tiktok")}
                  disabled={connectedAccounts.tiktok || connecting === "tiktok"}
                  className="w-full bg-black hover:bg-gray-800"
                >
                  {connecting === "tiktok" ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Conectando...
                    </>
                  ) : connectedAccounts.tiktok ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Conectado
                    </>
                  ) : (
                    <>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Conectar TikTok
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Progress Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Progreso de Configuración</CardTitle>
              <CardDescription>Conecta ambas cuentas para acceder al dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Instagram className="h-5 w-5 text-purple-500" />
                    <span className="font-medium">Instagram</span>
                  </div>
                  {connectedAccounts.instagram ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                  )}
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="h-5 w-5 text-black" />
                    <span className="font-medium">TikTok</span>
                  </div>
                  {connectedAccounts.tiktok ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                  )}
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Progreso total:</span>
                    <span className="font-medium">
                      {Object.values(connectedAccounts).filter(Boolean).length} de 2 completado
                      {Object.values(connectedAccounts).filter(Boolean).length === 2 ? " ✓" : " (ambas requeridas)"}
                    </span>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${(Object.values(connectedAccounts).filter(Boolean).length / 2) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                {connectedAccounts.instagram && connectedAccounts.tiktok && (
                  <div className="pt-4 border-t">
                    <Button className="w-full bg-green-500 hover:bg-green-600">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      ¡Configuración Completa! Acceder al Dashboard
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
