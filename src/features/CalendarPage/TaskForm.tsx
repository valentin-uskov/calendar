import React, { FC, FormEvent, useMemo, useState } from 'react'
import styled from '@emotion/styled'

import ColorPicker from '../../components/ColorPicker'
import { Color, Task } from '../../models'
import { SPACINGS } from '../../theme/spacings'

const StyledTaskForm = styled.div`
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
      
`
type Props = {
  changingTask: Task | null
  onClose: (event: React.MouseEvent<HTMLButtonElement>) => void
  onSubmit: (event: FormEvent<HTMLFormElement>, text: string, colors: Color[]) => void
}
const TaskForm: FC<Props> = ({ changingTask, onClose, onSubmit }) => {
  const [text, setText] = useState<string>(changingTask?.text || '')
  const [colors, setColors] = useState<Color[]>(changingTask?.colors || [])
  const isFormValid = useMemo(() => text.trim().length && colors.length, [text, colors])

  const handleChangeColor = (color: Color) =>
    setColors((prevState) =>
      prevState.includes(color) ? prevState.filter((prevColor) => prevColor !== color) : [...prevState, color],
    )

  return (
    <StyledTaskForm>
      <form onSubmit={(event) => onSubmit(event, text, colors)}>
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
          <button onClick={onClose}>Close</button>
          <button type="submit" disabled={!isFormValid}>
            Save
          </button>
        </footer>
      </form>
    </StyledTaskForm>
  )
}

export default TaskForm
