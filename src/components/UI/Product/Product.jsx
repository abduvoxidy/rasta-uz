import Image from "next/image";
import useTranslation from "next-translate/useTranslation";
import cls from "./Product.module.scss";
import numberToPrice from "utils/numberToPrice";
import { useMemo } from "react";
import { useSelector } from "react-redux";

export default function Product({ item, handleOpen }) {
  const { cartItems } = useSelector((state) => state.cart);
  const { t, lang } = useTranslation("common");

  const quantity = useMemo(() => {
    const products = cartItems.filter((value) => value.id == item.id);
    const totalQuantity = products.reduce((a, b) => {
      return a + b.quantity;
    }, 0);
    return totalQuantity;
  }, [cartItems]);

  return (
    <div
      className={`${cls.product} ${!item.is_active ? cls.disabled : ""}`}
      onClick={() => {
        if (item.is_active) handleOpen(item.id);
      }}
    >
      <div className={cls.info}>
        <p>{item?.name && item?.name[lang]}</p>
        <p>{item?.description && item?.description[lang]}</p>

        {!item.is_active ? (
          <span>{t("not_available")}</span>
        ) : (
          <p>{numberToPrice(item?.price_with_option, t("soum"))}</p>
        )}
      </div>
      <div className={cls.img}>
        {quantity ? <div className={cls.quantity}>{quantity}</div> : ""}
        <Image src={item?.image} layout="fill" objectFit="cover" />
      </div>
    </div>
  );
}
