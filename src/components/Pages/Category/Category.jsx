import { Container } from '@mui/material'
import RestaurantCard from 'components/UI/RestaurantCard/RestaurantCard'
import cls from './Category.module.scss'

export default function Category() {
  return (
    <main className={cls.main}>
      <Container>
        <p>26 результатов</p>
        <div className={cls.list}>
          <RestaurantCard className={cls.item} />
          <RestaurantCard className={cls.item} />
          <RestaurantCard className={cls.item} />
          <RestaurantCard className={cls.item} />
          <RestaurantCard className={cls.item} />
          <RestaurantCard className={cls.item} />
          <RestaurantCard className={cls.item} />
          <RestaurantCard className={cls.item} />
          <RestaurantCard className={cls.item} />
          <RestaurantCard className={cls.item} />
        </div>
      </Container>
    </main>
  )
}
