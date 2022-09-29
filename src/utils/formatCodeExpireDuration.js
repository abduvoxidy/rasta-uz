function pad(n) {
  return n < 10 ? `0${n}` : n
}

export default function formatCodeExpireDuration(secs) {
  const m = Math.floor(secs / 60)
  const s = Math.floor(secs - m * 60)
  return `${pad(m)}:${pad(s)}`
}
