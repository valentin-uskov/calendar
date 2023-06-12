import React, { useMemo, FC } from 'react'
import styled from '@emotion/styled'
import moment, { Moment } from 'moment'

import { SPACINGS } from '../../theme/spacings'
import { Task, Tasks } from '../../models'
import useLoadHolidays from '../../hooks/useLoadHolidays'
import generateMonthCalendar from './generateMonthCalendar'
import isExtraDays from './isExtraDays'
import CalendarCell from './CalendarCell'

const StyledMonthCalendar = styled.div`
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

type Props = {
  tasks: Tasks
  date: Moment
  onCellClick: (date: string) => void
  onTaskClick: (task: Task, date: string) => void
}

const MonthCalendar: FC<Props> = ({ tasks, date, onCellClick, onTaskClick }) => {
  const holidays = useLoadHolidays()
  const calendar: string[][] = useMemo(() => generateMonthCalendar(date), [date])

  return (
    <StyledMonthCalendar>
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
                    cellTasks={tasks[date] || []}
                    onCellClick={onCellClick}
                    onTaskClick={onTaskClick}
                    isExtraDay={isExtraDays(index, +moment(date).format('DD'))}
                    date={date}
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
    </StyledMonthCalendar>
  )
}

export default MonthCalendar
