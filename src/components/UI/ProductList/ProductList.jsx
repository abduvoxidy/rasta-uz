import Product from '../Product/Product'
import cls from './ProductList.module.scss'

export default function ProductList({
  title,
  products,
  scrollRef,
  handleOpen,
}) {
  return (
    <>
      <div className={cls.list} ref={scrollRef}>
        <p className={cls.title}>{title}</p>
        <div className={cls.body}>
          {products?.map((item) => (
            <Product key={item.id} item={item} handleOpen={handleOpen} />
          ))}
        </div>
      </div>
    </>
  )
}
