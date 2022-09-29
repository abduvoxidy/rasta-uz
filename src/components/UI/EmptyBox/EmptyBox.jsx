import GreenButton from '../Buttons/GreenButton'
import cls from './EmptyBox.module.scss'

export default function EmptyBox({
  fn,
  addText,
  title,
  subTitle,
  imgSrc,
  imgAlt,
}) {
  return (
    <div className={cls.empty}>
      <img src={imgSrc} alt={imgAlt} />
      <p>{title}</p>
      <span>{subTitle}</span>
      <GreenButton fullWidth size='large' onClick={fn}>
        {addText}
      </GreenButton>
    </div>
  )
}
