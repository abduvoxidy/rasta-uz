import { Container } from "@mui/material";
import useTranslation from "next-translate/useTranslation";
import cls from "./CurrentOrder.module.scss";
import { useRef } from "react";
import {
  OrderStepCheckIcon,
  OrderStepCourierIcon,
  OrderStepFinishedIcon,
  OrderStepRestaurantIcon,
} from "components/UI/Icons";
import OrderPaymentInfo from "../OrderOne/OrderPaymentInfo";
import { YMaps, Map, Placemark } from "react-yandex-maps";
import { useOrder } from "services";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { getStatusIndex, orderStepTitle } from "utils/statusConstants";

export default function CurrentOrder() {
  const router = useRouter();
  const { t } = useTranslation("common");
  const ref = useRef(null);
  const ymapsRef = useRef(null);
  const [initMap, setInitMap] = useState(null);
  const { order } = useOrder({
    orderId: router.query.id,
    orderOneQueryProps: {
      refetchInterval: 15000,
    },
    onSuccess: (res) => {},
  });
  const [mapPosition, setMapPosition] = useState({
    center: [41.32272, 69.19158],
    zoom: 14,
  });
  const [branchLocation, setBranchLocation] = useState([]);
  const [clientLocation, setClientLocation] = useState([]);
  const [courierLocation, setCourierLocation] = useState([]);
  const statusIndex = useMemo(() => {
    return getStatusIndex(order?.data?.status_id);
  }, [order.data]);

  const defaultColor = {
    circleColor: "#F4F4F4",
    fill: "#B0BABF",
  };
  const activeColor = {
    circleColor: "#22B573",
    fill: "#fff",
  };

  useEffect(() => {
    if (initMap) {
      console.log("init.....");
    }
    if (order.data && initMap) {
      let courierLoc;
      if (order.data.courier && order.data.courier.location) {
        courierLoc = [
          order.data.courier.location.lat,
          order.data.courier.location.long,
        ];
      }
      // setCenter([order.data.to_location.lat, order.data.to_location.long]);
      getData(order.data);

      centerMap(
        initMap,
        [order.data.steps[0].location.lat, order.data.steps[0].location.long],
        [order.data.to_location.lat, order.data.to_location.long],
        courierLoc
      );
    }
  }, [order.data, initMap]);

  const getData = (data) => {
    setBranchLocation([
      data.steps[0].location.lat,
      data.steps[0].location.long,
    ]);
    setClientLocation([data.to_location.lat, data.to_location.long]);
    if (data.courier && data.courier.location) {
      setCourierLocation([
        data.courier.location.lat,
        data.courier.location.long,
      ]);
    }
  };

  const centerMap = (ymaps, branchLoc, clientLoc, courierLoc) => {
    const bounds = [branchLoc, clientLoc, courierLoc];
    const distantion = Math.sqrt(
      (branchLoc[0] - clientLoc[0]) ** 2 + (branchLoc[1] - clientLoc[1]) ** 2
    );
    const myMap = ref.current;

    const result = ymaps.util.bounds.getCenterAndZoom(
      bounds,
      myMap.container.getSize(),
      myMap.options.get("projection")
    );

    if (result) {
      if (distantion < 0.01 && order.data) {
        setMapPosition({
          center: [order.data.to_location.lat, order.data.to_location.long],
          zoom: 16,
        });
      } else {
        setMapPosition({
          center: result.center,
          zoom: result.zoom,
        });
      }
    }
    // console.log("distantion", distantion);
    // console.log("result", result);
  };

  return (
    <main className={cls.main}>
      <Container>
        <div className={cls.orderItem}>
          <p className={cls.title}>{t("current_order")}</p>
        </div>
        <div className={cls.steps}>
          <div className={cls.infoBox}>
            <p className={cls.stepTitle}>
              {order.data && order.data?.steps[0]?.branch_name}
            </p>
            <span className={cls.processTitle}>
              {t(orderStepTitle(statusIndex))}
            </span>
          </div>
          <div className={cls.list}>
            <OrderStepCheckIcon
              circleColor={
                statusIndex === 1 || statusIndex <= 4
                  ? activeColor.circleColor
                  : defaultColor.circleColor
              }
              fill={
                statusIndex === 1 || statusIndex <= 4
                  ? activeColor.fill
                  : defaultColor.fill
              }
            />
            <div
              style={{
                backgroundColor:
                  (statusIndex <= 4 && statusIndex !== 1) || statusIndex === 2
                    ? activeColor.circleColor
                    : defaultColor.circleColor,
              }}
            />
            <OrderStepRestaurantIcon
              circleColor={
                (statusIndex <= 4 && statusIndex !== 1) || statusIndex === 2
                  ? activeColor.circleColor
                  : defaultColor.circleColor
              }
              fill={
                (statusIndex <= 4 && statusIndex !== 1) || statusIndex === 2
                  ? activeColor.fill
                  : defaultColor.fill
              }
            />
            <div
              style={{
                backgroundColor:
                  (statusIndex <= 4 &&
                    statusIndex !== 1 &&
                    statusIndex !== 2) ||
                  statusIndex === 3
                    ? activeColor.circleColor
                    : defaultColor.circleColor,
              }}
            />
            <OrderStepCourierIcon
              circleColor={
                (statusIndex <= 4 && statusIndex !== 1 && statusIndex !== 2) ||
                statusIndex === 3
                  ? activeColor.circleColor
                  : defaultColor.circleColor
              }
              fill={
                (statusIndex <= 4 && statusIndex !== 1 && statusIndex !== 2) ||
                statusIndex === 3
                  ? activeColor.fill
                  : defaultColor.fill
              }
            />
            <div
              style={{
                backgroundColor:
                  statusIndex === 4
                    ? activeColor.circleColor
                    : defaultColor.circleColor,
              }}
            />
            <OrderStepFinishedIcon
              circleColor={
                statusIndex === 4
                  ? activeColor.circleColor
                  : defaultColor.circleColor
              }
              fill={statusIndex === 4 ? activeColor.fill : defaultColor.fill}
            />
          </div>
        </div>
        <div className={cls.orderInfo}>
          <div className={cls.map}>
            <div className={cls.yandexMap}>
              <YMaps query={{ lang: "ru_RU", load: "util.bounds" }}>
                <Map
                  onLoad={(ymaps) => {
                    ymapsRef.current = ymaps;
                    setInitMap(ymaps);
                  }}
                  instanceRef={ref}
                  width="100%"
                  height="100%"
                  defaultState={{
                    center: [41.310589, 69.241567],
                    zoom: 14,
                  }}
                  state={mapPosition}
                >
                  <Placemark
                    options={{
                      iconLayout: "default#image",
                      iconImageHref: "/icons/restaurantLocation.png",
                      iconImageSize: [36, 36],
                      iconImageOffset: [0, 0],
                    }}
                    geometry={branchLocation}
                  />
                  <Placemark
                    options={{
                      iconLayout: "default#image",
                      iconImageHref: "/icons/clientLocation.png",
                      iconImageSize: [36, 36],
                      iconImageOffset: [0, 0],
                    }}
                    geometry={clientLocation}
                  />
                  {courierLocation.length > 0 ? (
                    <Placemark
                      options={{
                        iconLayout: "default#image",
                        iconImageHref: "/icons/courierLocation.png",
                        iconImageSize: [36, 36],
                        iconImageOffset: [0, 0],
                      }}
                      geometry={courierLocation}
                    />
                  ) : (
                    ""
                  )}
                </Map>
              </YMaps>
            </div>
          </div>
          <OrderPaymentInfo order={order.data} />
        </div>
      </Container>
    </main>
  );
}
