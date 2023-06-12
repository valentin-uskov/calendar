import moment, { Moment } from 'moment'
const generateMonthCalendar = (date: Moment) => {
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
}

export default generateMonthCalendar
