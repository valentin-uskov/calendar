import React from 'react'

import { CalendarTheme } from './theme/theme'
import { TasksProvider } from './context/tasksContext'
import CalendarPage from './features/CalendarPage'

function App() {
  return (
    <TasksProvider>
      <CalendarTheme>
        <CalendarPage />
      </CalendarTheme>
    </TasksProvider>
  )
}

export default App
