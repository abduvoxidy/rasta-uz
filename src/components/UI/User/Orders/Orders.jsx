import { useEffect, useState } from "react";
import useTranslation from "next-translate/useTranslation";
import { CircularProgress, Container } from "@mui/material";
import GreenButton from "components/UI/Buttons/GreenButton";
import { CalendarIcon, CrackIcon } from "components/UI/Icons";
import { useGetUser } from "hooks/useGetUser";
import InfiniteScroll from "react-infinite-scroll-component";
import { getCustomerOrders } from "services";
import { useRouter } from "next/router";

import {
  currentOrdersStatusId,
  historyOrdersStatusId,
} from "utils/statusConstants";
import OrderCard from "./OrderCard";
import cls from "./Orders.module.scss";

export default function Orders() {
  const [orderType, setOrderType] = useState("current");
  const user = useGetUser();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [hasMore, setMore] = useState(true);
  const [loader, setLoader] = useState(true);
  const [orders, setOrders] = useState({
    orders: [],
  });
  const { t } = useTranslation("common");

  useEffect(() => {
    if (user && user.id) {
      setLoader(true);
      getCustomerOrders({
        customer_id: user?.id,
        status_ids:
          orderType === "all" ? historyOrdersStatusId : currentOrdersStatusId,
        limit: 10,
        page,
      })
        .then((res) => {
          if (res.orders) {
            if (res.orders.length >= res.count) {
              setMore(false);
            }
            setOrders((prev) => ({
              count: +res.count,
              orders: [...prev.orders, ...res.orders],
            }));
          } else {
            setMore(false);
            setOrders({
              count: 0,
              orders: [],
            });
          }
        })
        .finally(() => {
          setLoader(false);
        });
    }
  }, [page, user, orderType]);

  useEffect(() => {
    setMore(true);
  }, [orderType]);

  const getNextItems = async () => {
    if (orders.orders.length >= orders.count) {
      setMore(false);
      return;
    }
    setPage((prev) => prev + 1);
  };

  return (
    <main className={cls.main}>
      <Container>
        <div className={cls.ordersMain}>
          <p
            className={cls.title}
            onClick={() => {
              // customerOrders.fetchNextPage();
            }}
          >
            {t("my_orders")}
          </p>
          <div className={cls.orderTypes}>
            <div
              className={`${cls.item} ${
                orderType === "current" ? cls.active : ""
              }`}
              onClick={() => {
                setOrderType("current");
                setOrders({
                  count: 0,
                  orders: [],
                });
                setPage(1);
              }}
            >
              <CrackIcon />
              &nbsp;
              <span>{t("current_orders")}</span>
            </div>
            <div
              className={`${cls.item} ${orderType === "all" ? cls.active : ""}`}
              onClick={() => {
                setOrderType("all");
                setOrders({
                  count: 0,
                  orders: [],
                });
                setPage(1);
              }}
            >
              <CalendarIcon />
              &nbsp;
              <span>{t("history_orders")}</span>
            </div>
          </div>

          {orders.orders?.length > 0 && (
            <InfiniteScroll
              dataLength={orders.orders.length}
              next={getNextItems}
              hasMore={hasMore}
              style={{ overflow: "hidden" }}
              loader={
                <div className={cls.loader}>
                  <CircularProgress size={40} />
                </div>
              }
            >
              <div className={cls.orders}>
                {orders?.orders?.map((item) => (
                  <OrderCard key={item.id} orderType={orderType} item={item} />
                ))}
              </div>
            </InfiniteScroll>
          )}
        </div>
        {!loader && orders.count === 0 && (
          <div className={cls.emptyOrder}>
            <img src="/gif/orderEmpty.gif" alt="order empty" />
            <p>
              {orderType === "all"
                ? t("you have not received any orders yet")
                : t("you have no current orders")}
            </p>
            <span>
              {t("you have no orders")}
              <br /> {t("place_order")}{" "}
            </span>
            <GreenButton onClick={() => router.push("/")}>
              {t("choose_restaurant")}
            </GreenButton>
          </div>
        )}
      </Container>
    </main>
  );
}
