import React, { ChangeEvent, FC } from 'react'
import ColorPicker from '../ColorPicker'
import { Color } from '../../models'
import { useTasks } from '../../context/tasksContext'

const TasksFilters: FC = () => {
  const { tasksFilters, updateTasksFilters } = useTasks()

  const handleChangeColorsFilter = (color: Color) =>
    updateTasksFilters({
      text: tasksFilters.text,
      colors: tasksFilters.colors.includes(color)
        ? tasksFilters.colors.filter((prevColor) => prevColor !== color)
        : [...tasksFilters.colors, color],
    })

  const handleChangeTextFilter = (event: ChangeEvent<HTMLInputElement>) =>
    updateTasksFilters({
      text: event.target.value,
      colors: tasksFilters.colors,
    })

  return (
    <div>
      <input
        value={tasksFilters.text}
        onChange={handleChangeTextFilter}
        type="text"
        name="search"
        placeholder="Type text to filter tasks..."
        autoComplete="off"
      />
      <ColorPicker value={tasksFilters.colors} onChange={handleChangeColorsFilter} />
    </div>
  )
}

export default TasksFilters
