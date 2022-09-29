import { useEffect } from 'react'

export default function useCodeExpire({
  seconds,
  isConfirm,
  setExpired,
  setSeconds,
}) {
  useEffect(() => {
    if (isConfirm) {
      let timer
      if (seconds !== 0) {
        timer = setTimeout(() => {
          setSeconds(seconds - 1)
        }, 1000)
      } else {
        setExpired(true)
        clearTimeout(timer)
      }
    }
  }, [seconds, isConfirm])
}
