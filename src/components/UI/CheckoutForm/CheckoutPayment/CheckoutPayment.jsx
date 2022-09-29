import { useState } from "react";
import useTranslation from "next-translate/useTranslation";
import { usePaymentCard } from "services";
import { CashIcon, CheckboxIcon, PaymentCardIcon } from "../../Icons";
import AddCard from "../../User/Profile/Cards/AddCard";
import cls from "./CheckoutPayment.module.scss";
import GreenButton from "../../Buttons/GreenButton";

export default function CheckoutPayment({
  user,
  setPaymentType,
  setCheckedPayment,
  checkedPayment,
  paymentType,
  deliveryType,
}) {
  const [open, setOpen] = useState(false);
  const { cards } = usePaymentCard({
    cardParams: {
      limit: 100,
      page: 1,
      user_id: user?.id,
    },
  });
  const { t } = useTranslation("common");

  return (
    <>
      <div className={cls.payment}>
        <div className={cls.list}>
          {deliveryType === "delivery" && (
            <div
              className={`${cls.item} ${!checkedPayment && cls.notChecked}`}
              onClick={() => {
                setPaymentType("cash");
                setCheckedPayment(true);
              }}
            >
              <div className={cls.info}>
                <CashIcon />
                <div className={cls.name}>
                  <span>{t("in_cash")}</span>
                </div>
              </div>
              {paymentType === "cash" ? (
                <CheckboxIcon />
              ) : (
                <div className={cls.checkbox} />
              )}
            </div>
          )}
          {cards?.data?.cards?.map((item) => (
            <div
              key={item.card_id}
              className={`${cls.item} ${!checkedPayment && cls.notChecked}`}
              onClick={() => {
                setCheckedPayment(true);
                setPaymentType({
                  card_id: item.card_id,
                  card_num: item.card_num,
                });
              }}
            >
              <div className={cls.info}>
                <PaymentCardIcon />
                <div className={cls.name}>
                  <span>•••• •••• •••• {item.card_num.substring(12, 16)}</span>
                  <span className={cls.expireDate}>
                    {item.card_expire_date.substring(0, 2)}/
                    {item.card_expire_date.substring(3, 5)}
                  </span>
                </div>
              </div>
              {paymentType.card_id === item.card_id ? (
                <CheckboxIcon />
              ) : (
                <div className={cls.checkbox} />
              )}
            </div>
          ))}

          <div className={cls.addCard} onClick={() => setOpen(true)}>
            <GreenButton fullWidth className={cls.addBtn} size="medium">
              {t("add_new_card")}
            </GreenButton>
          </div>
        </div>
      </div>
      <AddCard open={open} setOpen={setOpen} refetch={cards.refetch} />
    </>
  );
}
