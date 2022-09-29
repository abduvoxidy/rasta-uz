import { parseCookies } from 'nookies'
import { useEffect, useState } from 'react'

export const useGetUser = () => {
  const [user, setUser] = useState(null)
  const cookies = parseCookies()

  useEffect(() => {
    setUser(cookies.USER ? JSON.parse(cookies.USER) : null)

    return () => setUser(cookies.USER ? JSON.parse(cookies.USER) : null)
  }, [cookies.USER])

  return user
}
