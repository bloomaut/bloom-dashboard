import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Target } from "lucide-react";

interface Goal {
  id: string;
  title: string;
  current: number;
  target: number;
  unit: string;
  status: "on-track" | "behind" | "completed";
  platform: "instagram" | "tiktok" | "finances";
}

interface GoalsSummaryProps {
  goals: Goal[];
}

export function GoalsSummary({ goals }: GoalsSummaryProps) {
  const getStatusColor = (status: Goal["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "on-track":
        return "bg-blue-500";
      case "behind":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getPlatformColor = (platform: Goal["platform"]) => {
    switch (platform) {
      case "instagram":
        return "text-purple-600";
      case "tiktok":
        return "text-black";
      case "finances":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const getPlatformLabel = (platform: Goal["platform"]) => {
    switch (platform) {
      case "instagram":
        return "IG";
      case "tiktok":
        return "TK";
      case "finances":
        return "FIN";
      default:
        return "GEN";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center space-x-2'>
          <Target className='h-5 w-5' />
          <span>Metas</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {goals.map(goal => {
            const progress = Math.min((goal.current / goal.target) * 100, 100);

            return (
              <div key={goal.id} className='p-3 border rounded-lg space-y-2'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center space-x-2'>
                    <Badge variant='outline' className={`text-xs px-1.5 py-0.5 ${getPlatformColor(goal.platform)}`}>
                      {getPlatformLabel(goal.platform)}
                    </Badge>
                    <span className='text-sm font-medium truncate'>{goal.title}</span>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(goal.status)}`} />
                </div>

                <div className='space-y-1'>
                  <div className='flex justify-between text-xs text-gray-600'>
                    <span>
                      {goal.current.toLocaleString()} {goal.unit}
                    </span>
                    <span>
                      {goal.target.toLocaleString()} {goal.unit}
                    </span>
                  </div>
                  <Progress value={progress} className='h-1.5' />
                  <div className='text-xs text-gray-500 text-right'>{progress.toFixed(0)}%</div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
