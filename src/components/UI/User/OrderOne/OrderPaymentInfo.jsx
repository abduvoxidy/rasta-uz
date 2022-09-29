import GreyButton from "components/UI/Buttons/GreyButton";
import { ChatIcon } from "components/UI/Icons";
import useTranslation from "next-translate/useTranslation";
import Image from "next/image";
import cls from "./OrderOne.module.scss";
import numberToPrice from "utils/numberToPrice";
import { useEffect, useMemo, useState } from "react";
export default function OrderPaymentInfo({ order }) {
  const { t, lang } = useTranslation("common");

  const [promoSumDelivery, setPromoSumDelivery] = useState(0);
  useEffect(() => {
    if (order && order.delivery_discount_promotion_id) {
      if (order.delivery_discount_type === "percent") {
        setPromoSumDelivery(
          (order.co_delivery_price * order.delivery_discount_value) / 100
        );
      } else {
        setPromoSumDelivery(order.delivery_discount_value);
      }
    }
  }, [order]);

  const totalPrice = useMemo(() => {
    return order?.steps[0]?.products?.reduce((a, b) => {
      return a + b.total_amount;
    }, 0);
  }, [order]);

  return (
    <div className={cls.orderInfo}>
      <p className={cls.orderNumber}>
        {t("information_about_order")} №{order?.external_order_id}
      </p>
      <p className={cls.addressInfo}>
        <span>{t("address")}</span>
        <span>{order?.to_address}</span>
      </p>
      <div className={cls.products}>
        <p className={cls.innerTitle}>{t("order_list")}</p>
        {order?.steps[0]?.products?.map((item) => (
          <div className={cls.item} key={item.id}>
            <div className={cls.leftItem}>
              <div className={cls.img}>
                <Image
                  src={item.image ? item.image : "/images/product.jpg"}
                  layout="fill"
                  objectFit="contain"
                />
              </div>
              <div className={cls.name}>
                <span>{item.name && item.name[lang]}</span>
                <span>
                  {item.quantity} {t("pcs")}
                </span>
              </div>
            </div>
            <p className={cls.price}>
              {numberToPrice(item.total_amount, t("soum"))}
            </p>
          </div>
        ))}
      </div>
      <div className={cls.paymentOptions}>
        <p className={cls.innerTitle}>{t("payment")}</p>
        <div className={cls.option}>
          <span>{t("cost_goods")}</span>
          <span>{numberToPrice(totalPrice, t("soum"))}</span>
        </div>
        <div className={cls.option}>
          <span>{t("cost_delivery")}</span>
          <div className={`${promoSumDelivery ? cls.withPromo : ""}`}>
            <span>{numberToPrice(order?.co_delivery_price, t("soum"))}</span>
            {promoSumDelivery ? (
              <span>
                {numberToPrice(
                  order?.co_delivery_price - promoSumDelivery,
                  t("soum")
                )}
              </span>
            ) : (
              ""
            )}
          </div>
        </div>
        {/* <div className={cls.option}>
          <span>Сервисный сбор</span>
          <span>{numberToPrice(order.order_amount)}</span>
        </div> */}
      </div>
      <div className={cls.totalSum}>
        <span>{t("total")}</span>
        <span>
          {numberToPrice(
            order?.order_amount + (order?.co_delivery_price - promoSumDelivery),
            t("soum")
          )}
        </span>
      </div>
      {/* <GreyButton fullWidth icon={<ChatIcon />} size='large'>
        Связаться с поддержкой
      </GreyButton> */}
    </div>
  );
}
