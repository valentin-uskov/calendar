import { useEffect, useState } from 'react'
import { Holiday } from '../api/models'
import { loadNextWorldwideHolidays } from '../api/HolidaysApi'

const useLoadHolidays = () => {
  const [holidays, setHolidays] = useState<Holiday[]>([])

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const holidays: Holiday[] = await loadNextWorldwideHolidays()
        setHolidays(holidays.filter((holiday) => holiday.global && holiday.countryCode !== 'RU'))
      } catch (error) {
        console.error(error)
      }
    }

    fetchHolidays()
  }, [])

  return holidays
}

export default useLoadHolidays
