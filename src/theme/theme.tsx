import { Theme, ThemeProvider, Global, css } from '@emotion/react'
import React, { FC, ReactNode } from 'react'
import { SPACINGS } from '../constants/'

const theme: Theme = {
  fontColor: { primary: '#242328', secondary: '#7b7b7b' },
  backgroundColor: { primary: '#e2e6e9', secondary: '#ebebeb' },
  borderRadius: '4px',
}

const GlobalStyles = css`
  button {
    display: inline-block;
    background-color: ${theme.backgroundColor.secondary};
    border-radius: ${theme.borderRadius};
    padding: ${SPACINGS.REGULAR};
    margin: ${SPACINGS.SMALL};
    border: none;
    outline: none;
    font-weight: 700;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
      background-color: #c8c8c8;
    }
  }

  input,
  textarea {
    display: inline-block;
    padding: ${SPACINGS.SMALL};
    box-sizing: border-box;
    width: 100%;
    border-radius: ${theme.borderRadius};
    border: 1px solid #939393;
    outline: none;
    font-family: inherit;

    &:focus {
      border: 1px solid #494949;
      outline: none;
    }
  }
`

type Props = {
  children: ReactNode
}
export const CalendarTheme: FC<Props> = ({ children }) => (
  <ThemeProvider theme={theme}>
    <Global styles={GlobalStyles} />
    {children}
  </ThemeProvider>
)
