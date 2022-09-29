import Image from "next/image";
import useTranslation from "next-translate/useTranslation";
import { useDispatch, useSelector } from "react-redux";
import { decrement, increment } from "store/cart/cartSlice";
import numberToPrice from "utils/numberToPrice";
import CartButton from "../../Cart/CartButton";
import cls from "./CheckoutProducts.module.scss";

export default function CheckoutProducts({ cartItems }) {
  const dispatch = useDispatch();
  const { t } = useTranslation("common");

  return (
    <div className={cls.products}>
      <div className={cls.list}>
        {cartItems.map((item) => (
          <div className={cls.item} key={item.productOptionId}>
            <div className={cls.leftItem}>
              <div className={cls.img}>
                <Image src={item?.image} layout="fill" objectFit="cover" />
              </div>
              <div className={cls.info}>
                <div>
                  <p className={cls.name}>{item?.name?.ru}</p>
                  <p className={cls.optionName}>{item?.option?.name?.ru}</p>
                  <p className={cls.optionName}>
                    {item.option?.child_options
                      .map((item) => item?.name?.ru)
                      .join(", ")}
                  </p>
                </div>
                <div className={cls.priceRes}>
                  <p>
                    {numberToPrice(item.totalPrice * item.quantity, t("soum"))}
                  </p>
                  <CartButton
                    increment={() => {
                      dispatch(increment(item.productOptionId));
                    }}
                    decrement={() => {
                      dispatch(decrement(item.productOptionId));
                    }}
                    count={item.quantity}
                    className={cls.cartButtonRes}
                  />
                </div>
              </div>
              <CartButton
                increment={() => {
                  dispatch(increment(item.productOptionId));
                }}
                decrement={() => {
                  dispatch(decrement(item.productOptionId));
                }}
                count={item.quantity}
                className={cls.cartButton}
              />
            </div>
            <div className={cls.rightItem}>
              <span>
                {numberToPrice(item.totalPrice * item.quantity, t("soum"))}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
