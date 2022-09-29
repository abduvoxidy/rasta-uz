import cls from './Radio.module.scss'

export default function Radio({ checked, ...restProps }) {
  return (
    <div className={cls.radio}>
      <input type='radio' checked={checked} {...restProps} />
      <div className={`${cls.box} ${checked ? cls.active : ''}`}></div>
    </div>
  )
}
