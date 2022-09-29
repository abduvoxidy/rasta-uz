import { Container } from '@mui/material'
import { useEffect, useState } from 'react'
import RestaurantCategory from './RestaurantCategory'
import cls from './RestaurantCategory.module.scss'

export default function RestaurantFixedCategory({ ...props }) {
  const [animation, setAnimation] = useState(0)
  useEffect(() => {
    const handleScroll = () => {
      var element = document?.getElementById('slider-category')
      var distanceToTop = element?.getBoundingClientRect()?.top
      if (distanceToTop < -10) {
        setAnimation(true)
      } else {
        setAnimation(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <>
      <div
        className={`${cls.fixedCategories} ${animation ? cls.fixedHeder : ''}`}
      >
        <Container>
          <RestaurantCategory className={cls.fixedCategoriesTabs} {...props} />
        </Container>
      </div>
    </>
  )
}
