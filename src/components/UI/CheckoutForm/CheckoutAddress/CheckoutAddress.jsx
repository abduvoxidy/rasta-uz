import { CheckboxIcon, FastDeliveryIcon, SelfPickupIcon } from "../../Icons";
import cls from "./CheckoutAddress.module.scss";
import useTranslation from "next-translate/useTranslation";

export default function CheckoutAddress({
  user,
  deliveryType,
  setDeliveryType,
  nearestBranch,
  setBranch,
  branch,
}) {
  const { t } = useTranslation("common");

  return (
    <div className={cls.address}>
      <div className={cls.deliveryTypes}>
        <div
          className={`${cls.item} ${
            deliveryType === "delivery" ? cls.active : ""
          }`}
          onClick={() => setDeliveryType("delivery")}
        >
          <FastDeliveryIcon />
          &nbsp; {t("delivery")}
        </div>
        <div
          className={`${cls.item} ${
            deliveryType === "self-pickup" ? cls.active : ""
          }`}
          onClick={() => setDeliveryType("self-pickup")}
        >
          <SelfPickupIcon />
          &nbsp; {t("pickup")}
        </div>
      </div>
      {deliveryType === "delivery" && (
        <>
          <div className={cls.addressInfo}>
            <span>{user?.address?.address}</span>
            <span>{user?.phone}</span>
          </div>
          {/* Responsive */}
          <div className={cls.addressInfoRes}>
            <div className={cls.addressItem}>
              <p>{user?.address?.address}</p>
            </div>
            <div className={cls.addressItem}>
              <p>{user?.phone}</p>
            </div>
          </div>
          {/*  */}
        </>
      )}
      {deliveryType === "self-pickup" && (
        <div className={cls.branches}>
          {nearestBranch?.data?.branches.map((item) => (
            <div
              className={cls.branch}
              onClick={() => setBranch(item)}
              key={item.id}
            >
              <div className={cls.name}>
                <p>{item.name}</p>
                <p>{item.address}</p>
              </div>
              {/* Responsive */}
              <div className={cls.nameRes}>
                <p>{item.name}</p>
                <p>{item.address}</p>
              </div>
              {/*  */}
              {branch.id === item.id ? (
                <CheckboxIcon />
              ) : (
                <div className={cls.checkbox} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
