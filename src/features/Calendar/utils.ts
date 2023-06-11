export const isExtraDays = (week: number, date: number): boolean => {
  if (week === 0 && date > 10) {
    return true
  } else if ((week === 4 || week === 5) && date < 10) {
    return true
  } else {
    return false
  }
}
