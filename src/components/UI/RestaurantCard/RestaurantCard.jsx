import { useState } from "react";
import useTranslation from "next-translate/useTranslation";
import cls from "./RestaurantCard.module.scss";
import Image from "next/image";
import Link from "next/link";
import numberToPrice from "utils/numberToPrice";
import DeliveryTimeIcon, { FastDeliveryIcon, StarIcon } from "../Icons";
// import { checkDeliveryRestaurant } from "utils/statusConstants";

export default function RestaurantCard({ className = "", item }) {
  const [imageError, setImageError] = useState(false);
  const { t } = useTranslation("common");

  // const imgRestaurant = (func) => {
  //   if (func === "restaurant_delivers") return "/icons/restaurantDelivery.png";
  //   else if (func === "rasta_delivers") return "/icons/rastaLogo.png";
  //   else return "";
  // };

  return (
    <Link href={!item?.is_active ? "#" : `/restaurant/${item?.id}`}>
      <a
        onClick={(e) => {
          if (!item?.is_active) {
            e.preventDefault();
          }
        }}
      >
        <div className={`${cls.item} ${className} `}>
          <div
            className={`${cls.card} ${!item?.is_active ? cls.disabled : ""}`}
          >
            <div className={`${cls.img} ${!item?.is_active ? cls.closed : ""}`}>
              <Image
                src={
                  imageError
                    ? process.env.NEXT_PUBLIC_DEFAULT_IMAGE_RESTAURANT
                    : item?.menu_image
                }
                alt="restaurant1"
                layout="fill"
                objectFit="cover"
                onLoadingComplete={(result) => {
                  if (result.naturalWidth === 0) setImageError(true);
                }}
                onErrorCapture={() => setImageError(true)}
                onError={() => setImageError(true)}
                onEmptied={() => setImageError(true)}
              />
              {!item?.is_active && (
                <div className={cls.closedRestaurant}>
                  {t("restaurant_closed")}
                </div>
              )}
              {item?.max_delivery_time && (
                <div className={cls.deliveryTime}>
                  {" "}
                  <DeliveryTimeIcon />{" "}
                  {`${item?.max_delivery_time} ${t("minute")}`}
                </div>
              )}
            </div>
            <div className={cls.body}>
              <p>{item?.name}</p>
              {/* {item?.from_delivery && (
                <div className={cls.shipper}>
                  <img
                    className={cls.shipper_img}
                    src={imgRestaurant(
                      checkDeliveryRestaurant(item?.from_delivery)
                    )}
                    alt="rasta"
                  />
                  <p className={cls.shipper_name}>
                    {t(checkDeliveryRestaurant(item?.from_delivery))}
                  </p>
                </div>
              )} */}
              <div className={cls.options}>
                <div className={cls.option}>
                  <StarIcon />
                  {item?.rate} %
                </div>
                <div className={cls.option}>
                  <FastDeliveryIcon />
                  {numberToPrice(item?.delivery_price, t("soum"))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
}
