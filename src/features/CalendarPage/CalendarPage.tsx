import React, { useRef, useMemo, useState, FormEvent } from 'react'
import { v4 as uuidv4 } from 'uuid'
import styled from '@emotion/styled'
import moment, { Moment } from 'moment'
import { toJpeg } from 'html-to-image'

import { SPACINGS } from '../../theme/spacings'
import { Color, Task, Tasks } from '../../models'
import { useTasks } from '../../context/tasksContext'
import MonthCalendar from './MonthCalendar'
import Modal from '../../components/Modal'
import TaskForm from './TaskForm'
import TasksFilters from '../../components/TasksFilters'

const StyledCalendarPage = styled.div`
  width: 100%;

  > header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: ${SPACINGS.REGULAR};

    input {
      max-width: 240px;
    }

    > div {
      display: flex;

      > input,
      div {
        flex-shrink: 0;
        margin: 0 ${SPACINGS.REGULAR};
      }
    }
  }

  h2 {
    text-align: center;
  }

  table {
    width: calc(100% - ${SPACINGS.REGULAR} * 2);
    color: ${({ theme }) => theme.fontColor.primary};
    height: 100%;
    margin: ${SPACINGS.REGULAR};

    th {
      color: ${({ theme }) => theme.fontColor.secondary};
      padding: ${SPACINGS.HUGE};
    }

    td {
      width: calc(100% / 7);
      height: 100%;
    }
  }
`

const CalendarPage = () => {
  const { tasks, updateTasks, changingTask, updateChangingTask, changingDate, updateChangingDate, tasksFilters } =
    useTasks()
  const ref = useRef(null)
  const [date, setDate] = useState<Moment>(moment())
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  const filteredTasks = useMemo(
    () =>
      Object.keys(tasks).reduce((acc: Tasks, date: string) => {
        acc[date] =
          tasks[date].filter(
            (task) =>
              task.text.toLowerCase().includes(tasksFilters.text.toLowerCase()) &&
              (tasksFilters.colors.length ? task.colors.some((color) => tasksFilters.colors.includes(color)) : true),
          ) || []
        return acc
      }, {}),
    [tasks, tasksFilters],
  )

  const handleExportJSON = () => {
    const json = JSON.stringify(tasks, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const dataUrl = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = dataUrl
    link.download = 'tasks.json'
    link.click()
  }

  const handleExportJPEG = () => {
    if (!ref?.current) return

    toJpeg(ref.current, { quality: 1, backgroundColor: '#ffffff' }).then(function (dataUrl) {
      const link = document.createElement('a')
      link.download = 'calendar.jpeg'
      link.href = dataUrl
      link.click()
    })
  }

  const handleClickCell = (date: string) => {
    setIsModalOpen(true)
    updateChangingDate(date)
  }

  const handleClickTask = (task: Task, date: string) => {
    setIsModalOpen(true)
    updateChangingDate(date)
    updateChangingTask(task)
  }

  const onCloseTaskForm = (event: FormEvent<HTMLFormElement>, text: string, colors: Color[]) => {
    event.preventDefault()
    if (!changingDate) return

    if (changingTask) {
      const newTasks = tasks[changingDate].map((task) =>
        task.id === changingTask.id ? { id: task.id, text, colors } : task,
      )

      updateTasks({
        ...tasks,
        [changingDate]: newTasks,
      })
    } else {
      updateTasks({
        ...tasks,
        [changingDate]: [
          ...(tasks[changingDate]?.length ? tasks[changingDate] : []),
          { id: uuidv4(), text: text, colors: colors },
        ],
      })
    }

    updateChangingTask(null)
    updateChangingDate(null)
    setIsModalOpen(false)
  }

  const onSubmitTaskForm = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    updateChangingTask(null)
    updateChangingDate(null)
    setIsModalOpen(false)
  }

  return (
    <StyledCalendarPage>
      <Modal isOpen={isModalOpen} title={changingTask ? 'Edit Task' : 'Create Task'}>
        {isModalOpen && <TaskForm changingTask={changingTask} onClose={onSubmitTaskForm} onSubmit={onCloseTaskForm} />}
      </Modal>
      <header>
        <div>
          <button onClick={() => setDate(moment(date).subtract(1, 'month'))}>&#10094;</button>
          <button onClick={() => setDate(moment(date).add(1, 'month'))}>&#10095;</button>
        </div>

        <TasksFilters />

        <div>
          <button onClick={handleExportJSON}>Export JSON</button>
          <button onClick={handleExportJPEG}>Export Image</button>
        </div>
      </header>

      <div ref={ref}>
        <MonthCalendar tasks={filteredTasks} date={date} onCellClick={handleClickCell} onTaskClick={handleClickTask} />
      </div>
    </StyledCalendarPage>
  )
}

export default CalendarPage
