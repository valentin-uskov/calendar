import React, { FC, ReactNode } from 'react'
import styled from '@emotion/styled'
import { SPACINGS } from '../../theme/spacings'

type StyledModalProps = {
  isOpen: boolean
}

const StyledModal = styled.div<StyledModalProps>`
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
  }
`

type Props = {
  isOpen: boolean
  title: string
  children: ReactNode
}

const Modal: FC<Props> = ({ isOpen, title, children }) => {
  return (
    <StyledModal isOpen={isOpen}>
      <div>
        <header>
          <h3>{title}</h3>
        </header>
        {children}
      </div>
    </StyledModal>
  )
}

export default Modal
