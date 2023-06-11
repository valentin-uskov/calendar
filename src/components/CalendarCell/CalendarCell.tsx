import React, { FC, useMemo } from 'react'
import styled from '@emotion/styled'
import moment from 'moment'

import { useTasks } from '../../context/tasksContext'
import TaskItem from '../TaskItem'
import { Task } from '../../models'
import { Holiday } from '../../api/models'
import { SPACINGS } from '../../constants/'

type StyledCellProps = {
  isExtraDay: boolean
}

const StyledCell = styled.div<StyledCellProps>`
  background-color: ${(props) =>
    props.isExtraDay ? props.theme.backgroundColor.secondary : props.theme.backgroundColor.primary};
  min-height: 140px;
  height: 100%;
  border-radius: ${({ theme }) => theme.borderRadius};
  cursor: crosshair;

  > div {
    height: 100%;
    min-height: 140px;
    padding: ${SPACINGS.REGULAR} ${SPACINGS.REGULAR} ${SPACINGS.HUGE} ${SPACINGS.REGULAR};
    border-radius: ${({ theme }) => theme.borderRadius};
    box-sizing: border-box;
    transition: box-shadow 0.3s;
    font-size: 16px;
    font-weight: 700;
    color: ${(props) => (props.isExtraDay ? props.theme.fontColor.secondary : props.theme.fontColor.primary)};

    > div {
      transition: box-shadow 0.3s;
    }

    > span:nth-of-type(2) {
      font-size: 14px;
      font-weight: 400;
      padding-left: ${SPACINGS.SMALL};
      color: ${({ theme }) => theme.fontColor.secondary};
    }
  }
`

const StyledHoliday = styled.div`
  display: block;
  background-color: #5abb4a;
  color: #ffffff;
  font-size: 12px;
  font-weight: 400;
  padding: ${SPACINGS.TINY};
  margin: ${SPACINGS.TINY};
  border-radius: ${({ theme }) => theme.borderRadius};
  cursor: default;
  pointer-events: none;
`

type Props = {
  isExtraDay: boolean
  date: string
  filterText: string
  filterColors: string[]
  holidays: Holiday[]
}

const CalendarCell: FC<Props> = ({ isExtraDay, date, filterText, filterColors, holidays }) => {
  const {
    tasks,
    updateTasks,
    changingTask,
    updateChangingTask,
    changingDate,
    updateChangingDate,
    updateIsTaskModalOpen,
  } = useTasks()

  const filteredTasks = useMemo(
    () =>
      tasks[date]?.filter(
        (task) =>
          task.text.toLowerCase().includes(filterText.toLowerCase()) &&
          (filterColors.length ? task.colors.some((color) => filterColors.includes(color)) : true),
      ) || [],
    [tasks, filterText, filterColors],
  )

  const cellDate = useMemo(
    () =>
      moment(date).startOf('day').isSame(moment(date).startOf('month')) ||
      moment(date).endOf('day').isSame(moment(date).endOf('month'))
        ? moment(date).format('MMM D')
        : moment(date).format('D'),
    [date],
  )

  function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault()
    event.stopPropagation()
    const target = event.currentTarget as HTMLElement
    target.style.boxShadow = '0 0 8px #515151'
  }

  function handleDragLeave(event: React.DragEvent<HTMLDivElement>) {
    const target = event.currentTarget as HTMLElement
    target.style.boxShadow = 'none'
  }

  function handleDragStart(event: React.DragEvent<HTMLDivElement>, task: Task) {
    updateChangingDate(date)
    updateChangingTask(task)
  }

  function handleDragEnd(event: React.DragEvent<HTMLDivElement>) {
    const target = event.currentTarget as HTMLElement
    target.style.boxShadow = 'none'
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>, task: Task | null) {
    event.preventDefault()
    event.stopPropagation()
    const target = event.currentTarget as HTMLElement
    target.style.boxShadow = 'none'

    if (changingDate && changingTask && task) {
      const currentIndex = tasks[changingDate].indexOf(changingTask)
      const draggedDateTasks = tasks[changingDate]
      draggedDateTasks.splice(currentIndex, 1)

      const dropIndex = tasks[date].indexOf(task)
      tasks[date].splice(dropIndex, 0, changingTask)

      updateTasks({
        ...tasks,
        [changingDate]: draggedDateTasks,
      })
      updateChangingDate(null)
      updateChangingTask(null)
    }
  }

  const handleDropCell = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    const target = event.currentTarget as HTMLElement
    target.style.boxShadow = 'none'

    if (changingDate && changingTask) {
      const currentIndex = tasks[changingDate].indexOf(changingTask)
      const draggedDateTasks = tasks[changingDate]
      draggedDateTasks.splice(currentIndex, 1)

      updateTasks({
        ...tasks,
        [changingDate]: draggedDateTasks,
        [date]: [...(tasks[date] ? tasks[date] : []), changingTask],
      })

      updateChangingDate(null)
      updateChangingTask(null)
    }
  }

  function handleDragOverCell(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault()
    event.stopPropagation()
    const target = event.currentTarget as HTMLElement
    target.style.boxShadow = '0 0 8px #515151'
  }

  function handleDragLeaveCell(event: React.DragEvent<HTMLDivElement>) {
    const target = event.currentTarget as HTMLElement
    target.style.boxShadow = 'none'
  }

  const handleClickCell = () => {
    updateIsTaskModalOpen(true)
    updateChangingDate(date)
  }

  const handleClickTask = (task: Task) => {
    updateIsTaskModalOpen(true)
    updateChangingDate(date)
    updateChangingTask(task)
  }

  return (
    <>
      <StyledCell isExtraDay={isExtraDay} onClick={handleClickCell}>
        <div
          onDragLeave={(event) => handleDragLeaveCell(event)}
          onDragOver={(event) => handleDragOverCell(event)}
          onDrop={(event) => handleDropCell(event)}
        >
          <span>{cellDate}</span>
          {!!filteredTasks?.length && <span>{filteredTasks.length} card</span>}

          {holidays.map((holiday, index) => (
            <StyledHoliday key={index}>{holiday.name}</StyledHoliday>
          ))}

          {filteredTasks.map((task) => (
            <div
              key={task.id}
              draggable={true}
              onDragOver={(event) => handleDragOver(event)}
              onDragLeave={(event) => handleDragLeave(event)}
              onDragStart={(event) => handleDragStart(event, task)}
              onDragEnd={(event) => handleDragEnd(event)}
              onDrop={(event) => handleDrop(event, task)}
              onClick={() => handleClickTask(task)}
            >
              <TaskItem text={task.text} colors={task.colors} />
            </div>
          ))}
        </div>
      </StyledCell>
    </>
  )
}

export default CalendarCell
