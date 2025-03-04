import { useState, useCallback } from "react"

function useFetch(url: string, options: RequestInit) {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(url, options)
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const result = await response.json()
      setData(result)
    } catch (error) {
      setError(error)
    } finally {
      setIsLoading(false)
    }
  }, [url, options])

  return { data, error, isLoading, fetchData }
}

export default useFetch