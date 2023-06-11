import React, { useRef, useCallback, useMemo, useState, useEffect } from 'react'
import styled from '@emotion/styled'
import moment, { Moment } from 'moment/moment'
import { toJpeg } from 'html-to-image'

import { loadNextWorldwideHolidays } from '../../api/HolidaysApi'
import { isExtraDays } from './utils'
import CalendarCell from '../../components/CalendarCell'
import useDebounce from '../../hooks/useDebounce'
import ColorPicker from '../../components/ColorPicker'
import TaskModal from '../../components/TaskModal'
import { useTasks } from '../../context/tasksContext'
import { Holiday } from '../../api/models'
import { SPACINGS } from '../../constants/'
import { Color } from '../../models'

const StyledCalendar = styled.div`
  width: 100%;

  > header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: ${SPACINGS.REGULAR};

    input {
      max-width: 240px;
    }

    > div {
      display: flex;

      > input,
      div {
        flex-shrink: 0;
        margin: 0 ${SPACINGS.REGULAR};
      }
    }
  }

  h2 {
    text-align: center;
  }

  table {
    width: calc(100% - ${SPACINGS.REGULAR} * 2);
    color: ${({ theme }) => theme.fontColor.primary};
    height: 100%;
    margin: ${SPACINGS.REGULAR};

    th {
      color: ${({ theme }) => theme.fontColor.secondary};
      padding: ${SPACINGS.HUGE};
    }

    td {
      width: calc(100% / 7);
      height: 100%;
    }
  }
`

const Calendar = () => {
  const { tasks } = useTasks()
  const ref = useRef(null)
  const [date, setDate] = useState<Moment>(moment())
  const [filterText, setFilterText] = useState<string>('')
  const [filterColors, setColorsFilter] = useState<Color[]>([])
  const debouncedFilterText = useDebounce(filterText, 300)
  const [holidays, setHolidays] = useState<Holiday[]>([])

  const calendar: string[][] = useMemo(() => {
    const calendar: string[][] = []

    const startDate = moment([moment(date).year(), moment(date).month()])
      .clone()
      .startOf('month')
      .startOf('week')
    const endDate = moment([moment(date).year(), moment(date).month()])
      .clone()
      .endOf('month')
    const day = startDate.clone().subtract(1, 'day')

    while (day.isBefore(endDate, 'day')) {
      calendar.push(
        Array(7)
          .fill(0)
          .map(() => day.add(1, 'day').clone().format('YYYY-MM-DD')),
      )
    }

    return calendar
  }, [date])

  const handleExportJSON = useCallback(() => {
    const json = JSON.stringify(tasks, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const dataUrl = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = dataUrl
    link.download = 'tasks.json'
    link.click()
  }, [tasks])

  const handleExportJPEG = () => {
    if (!ref?.current) return

    toJpeg(ref.current, { quality: 1, backgroundColor: '#ffffff' }).then(function (dataUrl) {
      const link = document.createElement('a')
      link.download = 'calendar.jpeg'
      link.href = dataUrl
      link.click()
    })
  }

  const handleChangeColorsFilter = (color: Color) =>
    setColorsFilter((prevState) =>
      prevState.includes(color) ? prevState.filter((prevColor) => prevColor !== color) : [...prevState, color],
    )

  useEffect(() => {
    // eslint-disable-next-line
    ;(async () => {
      try {
        const holidays: Holiday[] = await loadNextWorldwideHolidays()
        setHolidays(holidays.filter((holiday) => holiday.global))
      } catch (error) {
        console.error(error)
      }
    })()
  }, [])

  return (
    <StyledCalendar>
      <TaskModal />
      <header>
        <div>
          <button onClick={() => setDate(moment(date).subtract(1, 'month'))}>&#10094;</button>
          <button onClick={() => setDate(moment(date).add(1, 'month'))}>&#10095;</button>
        </div>
        <div>
          <input
            value={filterText}
            onChange={(event) => setFilterText(event.target.value)}
            type="text"
            name="search"
            placeholder="Type text to filter tasks..."
            autoComplete="off"
          />
          <ColorPicker value={filterColors} onChange={handleChangeColorsFilter} />
        </div>
        <div>
          <button onClick={handleExportJSON}>Export JSON</button>
          <button onClick={handleExportJPEG}>Export Image</button>
        </div>
      </header>

      <div ref={ref}>
        <h2>{moment(date).format('MMMM YYYY')}</h2>
        <table>
          <thead>
            <tr></tr>
            <tr>
              <th>Sun</th>
              <th>Mon</th>
              <th>Tue</th>
              <th>Wed</th>
              <th>Thu</th>
              <th>Fri</th>
              <th>Sat</th>
            </tr>
          </thead>
          <tbody>
            {calendar.map((week: string[], index: number) => (
              <tr key={`row-${week[0]}`}>
                {week.map((date: string) => (
                  <td key={date}>
                    <CalendarCell
                      isExtraDay={isExtraDays(index, +moment(date).format('DD'))}
                      date={date}
                      filterText={debouncedFilterText.trim()}
                      filterColors={filterColors}
                      holidays={holidays.filter((holiday) =>
                        moment(holiday.date).startOf('day').isSame(moment(date).startOf('day')),
                      )}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </StyledCalendar>
  )
}

export default Calendar
