import React from 'react'

import { CalendarTheme } from './theme/theme'
import { TasksProvider } from './context/tasksContext'
import Calendar from './features/Calendar'

function App() {
  return (
    <TasksProvider>
      <CalendarTheme>
        <Calendar />
      </CalendarTheme>
    </TasksProvider>
  )
}

export default App
