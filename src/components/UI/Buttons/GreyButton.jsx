import { CircularProgress } from '@mui/material'
import cls from './Button.module.scss'

export default function GreyButton({
  children,
  fullWidth,
  icon,
  className = '',
  type = 'button',
  size = 'small',
  loading,
  buttonRef,
  ...restProps
}) {
  return (
    <button
      ref={buttonRef}
      className={`${cls.button} ${className} ${
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
