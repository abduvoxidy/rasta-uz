import { useEffect, useState } from 'react'

export default function useGeolocation() {
  const [location, setLocation] = useState({
    lat: 41.310589,
    long: 69.241567,
  })
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLocation({
        lat: position.coords.latitude,
        long: position.coords.longitude,
      })
    })
  }, [])
  return location
}
