import { useState, useEffect } from 'react'
export default function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay || 300)

    return () => {
      clearTimeout(handler)
    }
  }, [value])

  return debouncedValue
}
