import moment from 'moment/moment'

const formatCellDate = (date: string) =>
  moment(date).startOf('day').isSame(moment(date).startOf('month')) ||
  moment(date).endOf('day').isSame(moment(date).endOf('month'))
    ? moment(date).format('MMM D')
    : moment(date).format('D')

export default formatCellDate
