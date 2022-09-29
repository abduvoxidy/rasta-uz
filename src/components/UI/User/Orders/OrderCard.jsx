import { format } from "date-fns";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useState } from "react";
import numberToPrice from "utils/numberToPrice";
import { statusCheck } from "utils/statusConstants";
import cls from "./Orders.module.scss";
import Image from "next/image";
import localeUz from "date-fns/locale/uz";

export default function OrderCard({ item, orderType }) {
  const [imageError, setImageError] = useState(false);
  const { t } = useTranslation("common");

  return (
    <Link
      href={
        orderType === "all"
          ? `/user/orders/${item.id}`
          : `/user/orders/current/${item.id}`
      }
      key={item.id}
    >
      <a>
        <div className={cls.orderItem}>
          <div className={cls.leftItem}>
            <div className={cls.img}>
              <Image
                src={
                  imageError
                    ? process.env.NEXT_PUBLIC_DEFAULT_IMAGE_RESTAURANT
                    : item.branch_image
                }
                layout="fill"
                onLoadingComplete={(result) => {
                  if (result.naturalWidth === 0) setImageError(true);
                }}
                objectFit="cover"
                onErrorCapture={() => setImageError(true)}
                onError={() => setImageError(true)}
                onEmptied={() => setImageError(true)}
              />
            </div>
            <div className={cls.info}>
              <span>{item.steps[0].branch_name}</span>
              <span>
                {t("order")} №{item.external_order_id} (
                {format(new Date(item?.created_at), "dd.MM.yy HH:mm", {
                  locale: localeUz,
                })}
                )
              </span>
            </div>
          </div>
          <div className={cls.rightItem}>
            <span>
              {numberToPrice(
                item.co_delivery_price + item.order_amount,
                t("soum")
              )}
            </span>
            <span>{statusCheck(item.status_id, t)}</span>
          </div>
        </div>
      </a>
    </Link>
  );
}
