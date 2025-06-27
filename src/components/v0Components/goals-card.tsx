import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Target, Calendar, Instagram, MessageCircle, DollarSign } from "lucide-react"

interface Goal {
  id: string
  title: string
  current: number
  target: number
  unit: string
  deadline: string
  status: "on-track" | "behind" | "completed"
  icon: React.ReactNode
}

interface GoalsCardProps {
  platform: "instagram" | "tiktok" | "finances"
  goals: Goal[]
}

export function GoalsCard({ platform, goals }: GoalsCardProps) {
  const getStatusColor = (status: Goal["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "on-track":
        return "bg-blue-100 text-blue-800"
      case "behind":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: Goal["status"]) => {
    switch (status) {
      case "completed":
        return "Completado"
      case "on-track":
        return "En progreso"
      case "behind":
        return "Retrasado"
      default:
        return "Pendiente"
    }
  }

  const getPlatformTitle = () => {
    switch (platform) {
      case "instagram":
        return "Metas - Instagram"
      case "tiktok":
        return "Metas - TikTok"
      case "finances":
        return "Metas Financieras"
      default:
        return "Metas"
    }
  }

  const getPlatformIcon = () => {
    switch (platform) {
      case "instagram":
        return <Instagram className="h-5 w-5" />
      case "tiktok":
        return <MessageCircle className="h-5 w-5" />
      case "finances":
        return <DollarSign className="h-5 w-5" />
      default:
        return <Target className="h-5 w-5" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {getPlatformIcon()}
          <span>{getPlatformTitle()}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {goals.map((goal) => {
          const progress = Math.min((goal.current / goal.target) * 100, 100)

          return (
            <div key={goal.id} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {goal.icon}
                  <span className="font-medium">{goal.title}</span>
                </div>
                <Badge className={getStatusColor(goal.status)} variant="secondary">
                  {getStatusText(goal.status)}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>
                    {goal.current.toLocaleString()} {goal.unit}
                  </span>
                  <span className="text-gray-500">
                    Meta: {goal.target.toLocaleString()} {goal.unit}
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{progress.toFixed(1)}% completado</span>
                  <span className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{goal.deadline}</span>
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
