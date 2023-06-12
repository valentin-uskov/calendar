import React, { FC, useContext, useState } from 'react'
import { Filters, Task, Tasks } from '../models'
import mockData from '../data/mock-data'

interface TasksContext {
  tasks: Record<string, Task[]>
  updateTasks: React.Dispatch<React.SetStateAction<Tasks>>
  changingTask: Task | null
  updateChangingTask: React.Dispatch<React.SetStateAction<Task | null>>
  changingDate: string | null
  updateChangingDate: React.Dispatch<React.SetStateAction<string | null>>
  tasksFilters: Filters
  updateTasksFilters: React.Dispatch<React.SetStateAction<Filters>>
}

const TasksContext = React.createContext<TasksContext>({} as TasksContext)

interface Props {
  children: React.ReactNode
}

export const TasksProvider: FC<Props> = ({ children }) => {
  const [tasks, setTasks] = useState<Tasks>(mockData as Record<string, Task[]>)
  const [changingTask, setChangingTask] = useState<Task | null>(null)
  const [changingDate, setDraggedDate] = useState<string | null>(null)
  const [tasksFilters, setTasksFilters] = useState<Filters>({ text: '', colors: [] })

  return (
    <TasksContext.Provider
      value={{
        tasks,
        updateTasks: setTasks,
        changingTask,
        updateChangingTask: setChangingTask,
        changingDate,
        updateChangingDate: setDraggedDate,
        tasksFilters,
        updateTasksFilters: setTasksFilters,
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
    tasksFilters,
    updateTasksFilters,
  } = useContext(TasksContext)
  return {
    tasks,
    updateTasks,
    changingTask,
    updateChangingTask,
    changingDate,
    updateChangingDate,
    tasksFilters,
    updateTasksFilters,
  }
}
