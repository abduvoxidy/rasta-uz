import { format } from "date-fns";
import useTranslation from "next-translate/useTranslation";
import useBoxSticky from "hooks/useBoxSticky";
import useGeolocation from "hooks/useGeolocation";
import { useGetUser } from "hooks/useGetUser";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useFare } from "services";
import { totalPriceProducts } from "store/cart/cartSlice";
import numberToPrice from "utils/numberToPrice";
import GreenButton from "../../Buttons/GreenButton";
import cls from "./CheckoutPriceInfo.module.scss";

export default function CheckoutPriceInfo({
  confirmOrder,
  deliveryPriceSum,
  setDeliveryPrice,
  promocodeLogin,
  loading,
  branchId,
  state,
}) {
  const { t } = useTranslation("common");
  const user = useGetUser();
  const totalPrice = totalPriceProducts();
  //const { branchId } = useSelector((state) => state.common)
  const location = useGeolocation();
  //const pinned = useBoxSticky()
  const [promoSum, setPromoSum] = useState(0);
  const [promoSumDelivery, setPromoSumDelivery] = useState(0);
  const { deliveryPrice } = useFare({
    deliveryPriceMutationProps: {
      onSuccess: (res) => {
        setDeliveryPrice(res.price);
      },
    },
  });
  useEffect(() => {
    if (
      promocodeLogin.data &&
      promocodeLogin.data.id &&
      state.deliveryType === "delivery"
    ) {
      if (promocodeLogin.data.expense_type === "product") {
        if (promocodeLogin.data.discount_type === "percent") {
          setPromoSum((totalPrice * promocodeLogin.data.discount_value) / 100);
        } else {
          setPromoSum(promocodeLogin.data.discount_value);
        }
      } else {
        if (
          promocodeLogin.data.discount_type === "percent" &&
          deliveryPrice.data
        ) {
          setPromoSumDelivery(
            (deliveryPrice.data.price * promocodeLogin.data.discount_value) /
              100
          );
        } else {
          setPromoSumDelivery(promocodeLogin.data.discount_value);
        }
      }
    }
  }, [promocodeLogin, deliveryPrice.data]);

  useEffect(() => {
    if (state.deliveryType === "delivery" && branchId && user) {
      deliveryPrice.mutate({
        branch_id: branchId,
        date_time: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        lat: user?.address?.location?.lat || location.lat,
        long: user?.address?.location?.long || location.long,
      });
    }
    if (state.deliveryType === "self-pickup") {
      setDeliveryPrice(0);
      setPromoSumDelivery(0);
    }
  }, [branchId, user, state.deliveryType]);

  return (
    <div className={cls.ordeInfo}>
      <div className={cls.priceInfo}>
        <p>{t("total")}</p>
        <div className={cls.priceOptions}>
          <div
            className={`${cls.item} ${promoSum > 0 ? cls.withPromocode : ""}`}
          >
            <span>{t("cost_goods")}</span>
            <div
              className={`${cls.price} ${promoSum > 0 ? cls.promocodeSum : ""}`}
            >
              <span>{numberToPrice(totalPrice, t("soum"))}</span>
              {promoSum > 0 && (
                <span>{numberToPrice(totalPrice - promoSum, t("soum"))}</span>
              )}
            </div>
          </div>

          <div
            className={`${cls.item} ${
              promoSumDelivery > 0 ? cls.withPromocode : ""
            }`}
          >
            <span>{t("delivery_service")}</span>
            <div
              className={`${cls.price} ${
                promoSumDelivery > 0 ? cls.promocodeSum : ""
              }`}
            >
              <span>{numberToPrice(deliveryPriceSum, t("soum"))}</span>
              {promoSumDelivery > 0 && (
                <span>
                  {numberToPrice(
                    deliveryPriceSum - promoSumDelivery,
                    t("soum")
                  )}
                </span>
              )}
            </div>
          </div>
          <div className={cls.item}>
            <span>{t("total_amount")}</span>
            <span>
              {numberToPrice(
                deliveryPriceSum + totalPrice - promoSum - promoSumDelivery,
                t("soum")
              )}
            </span>
          </div>
          {(promoSum > 0 || promoSumDelivery > 0) && (
            <div className={cls.item}>
              <span>{t("promo_discounts")}</span>
              <span>
                {numberToPrice(promoSum || promoSumDelivery, t("soum"))}
              </span>
            </div>
          )}
        </div>
        {/* <a href='#'>У меня есть промокод</a> */}
        <GreenButton
          loading={loading}
          size="large"
          fullWidth
          onClick={confirmOrder}
        >
          {t("confirm")}
        </GreenButton>
      </div>
    </div>
  );
}
