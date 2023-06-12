import { colors } from './theme/colors'

export type Color = (typeof colors)[number]

export type Task = {
  id: string
  text: string
  colors: Color[]
}

export type Tasks = Record<string, Task[]>

export type Filters = {
  text: string
  colors: Color[]
}
