import React, { FC, useContext, useState } from 'react'
import { Task } from '../models'
import mockData from '../data/mock-data'

interface TasksContext {
  tasks: Record<string, Task[]>
  updateTasks: React.Dispatch<React.SetStateAction<Record<string, Task[]>>>
  changingTask: Task | null
  updateChangingTask: React.Dispatch<React.SetStateAction<Task | null>>
  changingDate: string | null
  updateChangingDate: React.Dispatch<React.SetStateAction<string | null>>
  isTaskModalOpen: boolean
  updateIsTaskModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const TasksContext = React.createContext<TasksContext>({} as TasksContext)

interface Props {
  children: React.ReactNode
}

export const TasksProvider: FC<Props> = ({ children }) => {
  const [tasks, setTasks] = useState<Record<string, Task[]>>(mockData as Record<string, Task[]>)
  const [changingTask, setchangingTask] = useState<Task | null>(null)
  const [changingDate, setDraggedDate] = useState<string | null>(null)
  const [isTaskModalOpen, setIsModalOpen] = useState<boolean>(false)

  return (
    <TasksContext.Provider
      value={{
        tasks,
        updateTasks: setTasks,
        changingTask,
        updateChangingTask: setchangingTask,
        changingDate,
        updateChangingDate: setDraggedDate,
        isTaskModalOpen,
        updateIsTaskModalOpen: setIsModalOpen,
      }}
    >
      {children}
    </TasksContext.Provider>
  )
}

export const useTasks = () => {
  const {
    tasks,
    updateTasks,
    changingTask,
    updateChangingTask,
    changingDate,
    updateChangingDate,
    isTaskModalOpen,
    updateIsTaskModalOpen,
  } = useContext(TasksContext)
  return {
    tasks,
    updateTasks,
    changingTask,
    updateChangingTask,
    changingDate,
    updateChangingDate,
    isTaskModalOpen,
    updateIsTaskModalOpen,
  }
}
