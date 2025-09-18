"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Calendar, Camera, Video, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";

interface Task {
  id: string;
  title: string;
  description: string;
  type: "post" | "story" | "video" | "engagement" | "analysis";
  platform: "instagram" | "tiktok" | "both";
  day: string; // Cambiar de time a day
  status: "pending" | "in-progress" | "completed" | "overdue";
  priority: "high" | "medium" | "low";
  details?: string; // Agregar campo para detalles adicionales
}

interface ScheduleCardProps {
  title: string;
  tasks: Task[];
  type: "daily" | "weekly";
}

export function ScheduleCard({ title, tasks, type }: ScheduleCardProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getTaskIcon = (taskType: Task["type"]) => {
    switch (taskType) {
      case "post":
        return <Camera className='h-4 w-4' />;
      case "story":
        return <Camera className='h-4 w-4' />;
      case "video":
        return <Video className='h-4 w-4' />;
      case "engagement":
        return <CheckCircle className='h-4 w-4' />;
      case "analysis":
        return <FileText className='h-4 w-4' />;
      default:
        return <Clock className='h-4 w-4' />;
    }
  };

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "border-l-red-500";
      case "medium":
        return "border-l-yellow-500";
      case "low":
        return "border-l-green-500";
      default:
        return "border-l-gray-300";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center space-x-2'>
          <Calendar className='h-5 w-5' />
          <span>{title}</span>
          <Badge variant='outline' className='ml-auto'>
            {tasks.filter(t => t.status === "completed").length}/{tasks.length} completadas
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-3'>
        {tasks.length === 0 ? (
          <div className='text-center py-8 text-gray-500'>
            <Calendar className='h-12 w-12 mx-auto mb-2 opacity-50' />
            <p>No hay tareas programadas</p>
          </div>
        ) : (
          tasks.map(task => (
            <div
              key={task.id}
              className={`p-4 border-l-4 ${getPriorityColor(task.priority)} bg-gray-50 rounded-r-lg space-y-3 cursor-pointer hover:bg-gray-100 transition-colors`}
              onClick={() => {
                setSelectedTask(task);
                setIsModalOpen(true);
              }}
            >
              <div className='flex items-start justify-between'>
                <div className='flex items-start space-x-3'>
                  <div className='mt-1'>{getTaskIcon(task.type)}</div>
                  <div className='flex-1'>
                    <div className='font-medium text-gray-900'>{task.title}</div>
                    <p className='text-sm text-gray-600 mt-1'>{task.description}</p>
                    <div className='flex items-center space-x-2 mt-2'>
                      <Badge variant='outline' className='text-xs'>
                        {task.platform === "both" ? "IG + TikTok" : task.platform.toUpperCase()}
                      </Badge>
                      <span className='text-xs text-gray-500 flex items-center space-x-1'>
                        <Calendar className='h-3 w-3' />
                        <span>{task.day}</span>
                      </span>
                    </div>
                  </div>
                </div>
                <Badge className={getStatusColor(task.status)} variant='secondary'>
                  {task.status === "completed" && "Completada"}
                  {task.status === "in-progress" && "En progreso"}
                  {task.status === "pending" && "Pendiente"}
                  {task.status === "overdue" && "Vencida"}
                </Badge>
              </div>
            </div>
          ))
        )}
      </CardContent>
      {/* Modal de detalles de tarea */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle className='flex items-center space-x-2'>
              {selectedTask && getTaskIcon(selectedTask.type)}
              <span>{selectedTask?.title}</span>
            </DialogTitle>
          </DialogHeader>
          {selectedTask && (
            <div className='space-y-4'>
              <div>
                <div className='font-medium text-gray-900 mb-2'>Descripción</div>
                <p className='text-gray-600'>{selectedTask.description}</p>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <div className='font-medium text-gray-900 mb-1'>Plataforma</div>
                  <Badge variant='outline'>
                    {selectedTask.platform === "both" ? "Instagram + TikTok" : selectedTask.platform.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <div className='font-medium text-gray-900 mb-1'>Día</div>
                  <p className='text-gray-600'>{selectedTask.day}</p>
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <div className='font-medium text-gray-900 mb-1'>Estado</div>
                  <Badge className={getStatusColor(selectedTask.status)} variant='secondary'>
                    {selectedTask.status === "completed" && "Completada"}
                    {selectedTask.status === "in-progress" && "En progreso"}
                    {selectedTask.status === "pending" && "Pendiente"}
                    {selectedTask.status === "overdue" && "Vencida"}
                  </Badge>
                </div>
                <div>
                  <div className='font-medium text-gray-900 mb-1'>Prioridad</div>
                  <Badge
                    variant='outline'
                    className={
                      selectedTask.priority === "high"
                        ? "border-red-300 text-red-700"
                        : selectedTask.priority === "medium"
                          ? "border-yellow-300 text-yellow-700"
                          : "border-green-300 text-green-700"
                    }
                  >
                    {selectedTask.priority === "high" && "Alta"}
                    {selectedTask.priority === "medium" && "Media"}
                    {selectedTask.priority === "low" && "Baja"}
                  </Badge>
                </div>
              </div>

              <div>
                <div className='font-medium text-gray-900 mb-1'>Tipo de tarea</div>
                <p className='text-gray-600 capitalize'>
                  {selectedTask.type === "post" && "Publicación"}
                  {selectedTask.type === "story" && "Historia"}
                  {selectedTask.type === "video" && "Video"}
                  {selectedTask.type === "engagement" && "Interacción"}
                  {selectedTask.type === "analysis" && "Análisis"}
                </p>
              </div>

              {selectedTask.details && (
                <div>
                  <div className='font-medium text-gray-900 mb-2'>Detalles adicionales</div>
                  <p className='text-gray-600'>{selectedTask.details}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
