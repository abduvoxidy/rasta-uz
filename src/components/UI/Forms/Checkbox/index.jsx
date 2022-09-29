import cls from './Checkbox.module.scss'

export default function Checkbox({ checked, ...restProps }) {
  return (
    <div className={cls.checkbox}>
      <input type='checkbox' checked={checked} {...restProps} />
      <div className={`${cls.box} ${checked ? cls.active : ''}`}>
        <svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
          <path
            fill-rule='evenodd'
            clip-rule='evenodd'
            d='M18.7413 6.24298C18.4744 6.04628 18.1403 5.9637 17.8124 6.01339C17.4846 6.06309 17.19 6.241 16.9933 6.50798L10.7653 14.961L6.78034 11.773C6.43275 11.4824 5.9551 11.4026 5.53192 11.5645C5.10874 11.7263 4.8063 12.1045 4.74142 12.553C4.67655 13.0014 4.8594 13.4498 5.21934 13.725L10.2193 17.725C10.4411 17.9016 10.7168 17.9966 11.0003 17.994C11.3957 17.9952 11.7686 17.8099 12.0063 17.494L19.0063 7.99398C19.2042 7.72694 19.2876 7.39203 19.2378 7.06339C19.1881 6.73475 19.0094 6.43949 18.7413 6.24298Z'
            fill='currentColor'
          ></path>
        </svg>
      </div>
    </div>
  )
}
