import { useMemo } from 'react'
import { rem } from 'utils/pxToRem'
import GreyButton from '../Buttons/GreyButton'
import { AddIcon, SubstractIcon } from '../Icons'
import cls from './Cart.module.scss'

export default function CartButton({
  className = '',
  size = 40,
  increment,
  decrement,
  count,
}) {
  const styles = useMemo(
    () => ({
      width: rem(size),
      height: rem(size),
      maxWidht: rem(size),
      maxHeight: rem(size),
    }),
    [size]
  )

  return (
    <div className={`${cls.buttons} ${className}`}>
      <GreyButton style={styles} onClick={decrement}>
        <SubstractIcon />
      </GreyButton>
      <div className={cls.count} style={styles}>
        {count || 1}
      </div>
      <GreyButton style={styles} onClick={increment}>
        <AddIcon />
      </GreyButton>
    </div>
  )
}
