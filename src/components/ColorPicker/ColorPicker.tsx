import React, { FC } from 'react'
import styled from '@emotion/styled'
import { colors as availableColors } from '../../constants'
import { Color } from '../../models'

const StyledColorPicker = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 0;

  span {
    width: 100%;
  }
`
type StyledColorButtonProps = {
  color: string
  isSelected: boolean
}
const StyledColorButton = styled.button<StyledColorButtonProps>`
  width: 24px;
  height: 24px;
  margin: 4px;
  cursor: pointer;
  background-color: ${(props) => props.color};
  outline: ${(props) => (props.isSelected ? '2px solid green' : '2px solid transparent')};
  border: 2px solid white;

  &:hover {
    background-color: ${(props) => props.color};
  }
`

type Props = {
  value: Color[]
  onChange: (color: Color) => void
  label?: string
}

const ColorPicker: FC<Props> = ({ value, onChange, label }) => {
  return (
    <StyledColorPicker>
      {label && <span>{label}</span>}
      {availableColors.map((color) => (
        <StyledColorButton
          key={color}
          color={color}
          isSelected={value.includes(color)}
          onClick={(event) => {
            event.preventDefault()
            onChange(color)
          }}
        />
      ))}
    </StyledColorPicker>
  )
}

export default ColorPicker
