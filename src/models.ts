import { colors } from './constants'

export type Color = (typeof colors)[number]

export type Task = {
  id: string
  text: string
  colors: Color[]
}
