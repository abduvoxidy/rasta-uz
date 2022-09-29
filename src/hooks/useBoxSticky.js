import { useEffect, useState } from 'react'

export default function useBoxSticky() {
  const [pinned, setPinned] = useState(false)
  const handleScroll = () => {
    const allWithClass = Array.from(
      document.getElementsByClassName('headroom--pinned')
    )
    setPinned(allWithClass.length > 0)
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return pinned
}
