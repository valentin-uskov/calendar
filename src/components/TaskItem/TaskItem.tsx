import React, { FC } from 'react'
import styled from '@emotion/styled'
import { SPACINGS } from '../../theme/spacings'

const StyledTaskItem = styled.div`
  background-color: #ffffff;
  border-radius: ${({ theme }) => theme.borderRadius};
  cursor: pointer;
  margin: ${SPACINGS.SMALL} 0;
  padding: ${SPACINGS.SMALL};

  h4 {
    display: block;
    margin: ${SPACINGS.SMALL} 0 0 0;
    font-size: 14px;
    font-weight: 400;
  }

  > div {
    display: flex;

    span {
      width: calc(25% - ${SPACINGS.SMALL});
      margin-right: ${SPACINGS.SMALL};
      height: 8px;
      border-radius: ${({ theme }) => theme.borderRadius};
    }
  }
`

type Props = {
  text: string
  colors: string[]
}

const TaskItem: FC<Props> = ({ text, colors }) => {
  return (
    <StyledTaskItem>
      <div>
        {colors.map((color, index) => (
          <span key={index} style={{ backgroundColor: `${color}` }} />
        ))}
      </div>
      <h4>{text}</h4>
    </StyledTaskItem>
  )
}

export default TaskItem
