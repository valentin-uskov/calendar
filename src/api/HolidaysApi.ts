export const loadNextWorldwideHolidays = async () => {
  const response = await fetch(`https://date.nager.at/api/v3/NextPublicHolidaysWorldwide`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return await response.json()
}
