import React, { FC, FormEvent, useCallback, useEffect, useMemo, useState } from 'react'
import styled from '@emotion/styled'
import { v4 as uuidv4 } from 'uuid'

import ColorPicker from '../ColorPicker'
import { useTasks } from '../../context/tasksContext'
import { SPACINGS } from '../../constants/'
import { Color } from '../../models'

type StyledTaskModalProps = {
  isOpen: boolean
}

const StyledTaskModal = styled.div<StyledTaskModalProps>`
  display: ${(props) => (props.isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  position: fixed;
  background: rgba(0, 0, 0, 0.3);
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  > div {
    background-color: #ffffff;
    border-radius: ${({ theme }) => theme.borderRadius};
    padding: ${SPACINGS.REGULAR} ${SPACINGS.BIG};
    max-width: 240px;

    header {
      h3 {
        margin: 0 0 ${SPACINGS.REGULAR} 0;
      }
    }

    form {
      display: flex;
      flex-direction: column;

      > * {
        margin: ${SPACINGS.REGULAR} 0;
      }

      textarea {
        resize: none;
      }

      label {
        margin-bottom: 0;
      }

      footer {
        display: flex;
        justify-content: space-between;
        margin-top: ${SPACINGS.BIG};
      }
    }
  }
`

const TaskModal: FC = () => {
  const {
    tasks,
    updateTasks,
    changingTask,
    updateChangingTask,
    changingDate,
    updateChangingDate,
    isTaskModalOpen,
    updateIsTaskModalOpen,
  } = useTasks()

  const [text, setText] = useState<string>('')
  const [colors, setColors] = useState<Color[]>([])
  const isFormValid = useMemo(() => text.trim().length && colors.length, [text, colors])

  useEffect(() => {
    setText(changingTask?.text || '')
    setColors(changingTask?.colors || [])
  }, [changingTask, changingDate])

  const handleSubmitForm = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      if (!changingDate) return

      event.preventDefault()

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

      setText('')
      setColors([])
      updateChangingTask(null)
      updateChangingDate(null)
      updateIsTaskModalOpen(false)
    },
    [tasks, text, colors],
  )

  const handleClose = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    updateChangingTask(null)
    updateChangingDate(null)
    updateIsTaskModalOpen(false)
  }

  const handleChangeColor = (color: Color) =>
    setColors((prevState) =>
      prevState.includes(color) ? prevState.filter((prevColor) => prevColor !== color) : [...prevState, color],
    )

  return (
    <StyledTaskModal isOpen={isTaskModalOpen}>
      <div>
        <header>
          <h3>{changingTask ? 'Edit Task' : 'Create Task'}</h3>
        </header>
        <form onSubmit={handleSubmitForm}>
          <label htmlFor="text">Text</label>
          <textarea
            value={text}
            onChange={(event) => {
              setText(event.target.value)
            }}
            rows={3}
            name="text"
            id="text"
            placeholder="Write a text..."
            required
          />
          <ColorPicker value={colors} onChange={handleChangeColor} label="Choose colors" />
          <footer>
            <button onClick={handleClose}>Close</button>
            <button type="submit" disabled={!isFormValid}>
              Save
            </button>
          </footer>
        </form>
      </div>
    </StyledTaskModal>
  )
}

export default TaskModal
