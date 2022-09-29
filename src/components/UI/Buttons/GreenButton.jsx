import { CircularProgress } from '@mui/material'
import cls from './Button.module.scss'

export default function GreenButton({
  children,
  type = 'button',
  fullWidth,
  className = '',
  icon,
  size = 'small',
  loading,
  ...restProps
}) {
  return (
    <button
      className={`${cls.greenButton} ${className} ${
        fullWidth ? cls.fullWidth : ''
      } ${cls[size]}`}
      type={type}
      {...restProps}
    >
      {loading && <CircularProgress size={20} color='inherit' />}
      {icon}
      {children}
    </button>
  )
}
