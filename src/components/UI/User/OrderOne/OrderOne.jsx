import { Container } from "@mui/material";
import useTranslation from "next-translate/useTranslation";
import GreenButton from "components/UI/Buttons/GreenButton";
import GreyButton from "components/UI/Buttons/GreyButton";
import { ChatIcon } from "components/UI/Icons";
import Image from "next/image";
import cls from "./OrderOne.module.scss";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";
import OrderPaymentInfo from "./OrderPaymentInfo";
import { useOrder } from "services";
import { useRouter } from "next/router";
import { format } from "date-fns";

export default function OrderOne() {
  const router = useRouter();
  const { t } = useTranslation("common");
  const { order } = useOrder({
    orderId: router.query.id,
  });

  return (
    <main className={cls.main}>
      <Container>
        <div className={cls.orderItem}>
          <p className={cls.title}>
            <Link href="/user/orders">
              <a className={cls.back}>
                <ArrowBackIcon />
              </a>
            </Link>
            {t("order")} №{order?.data?.external_order_id}
          </p>
          <p className={cls.expireTime}>
            {t("created_at")}{" "}
            {order?.data?.created_at &&
              format(new Date(order?.data?.created_at), "dd.MM.yy HH:mm")}
          </p>
          <OrderPaymentInfo order={order.data} />
        </div>
      </Container>
    </main>
  );
}
