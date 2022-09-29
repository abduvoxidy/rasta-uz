import { request } from "./http-client";
import { useInfiniteQuery, useMutation, useQuery } from "react-query";
import { requestConstants } from "./constants";

export const getOrders = async (params) =>
  await request.get("order", { params });

const getOrdersOne = async (orderId) => await request.get(`order/${orderId}`);

export const getCustomerOrders = async (params) => {
  return await request.get(`customers/${params.customer_id}/orders`, {
    params,
  });
};

const createOrder = async (data, params) =>
  await request.post("ondemand-order", data, { params });

const createOrderByCard = async (data, params) =>
  await request.post(`order/${data}/pay-by-card`);

const defaultQueryProps = {
  enabled: false,
};

export const useOrder = ({
  orderParams,
  orderQueryProps = defaultQueryProps,
  createMutationProps,
  createMutationParams,
  createByCardParams,
  createByCardProps,
  orderId,
  orderOneQueryProps,
  onSuccess = () => {},
} = {}) => {
  const orders = useQuery(
    [requestConstants.GET_ORDERS, orderParams],
    () => getOrders(orderParams),
    { enabled: !!(orderParams && orderParams.customer_id) }
  );

  const order = useQuery(
    [requestConstants.GET_ORDER, orderId],
    () => getOrdersOne(orderId),
    { enabled: Boolean(orderId), ...orderOneQueryProps, onSuccess }
  );

  const createMutation = useMutation(
    (data) => createOrder(data, createMutationParams),
    createMutationProps
  );

  const createByCard = useMutation(
    (data) => createOrderByCard(data, createByCardParams),
    createByCardProps
  );

  return {
    orders,
    createMutation,
    createByCard,
    order,
  };
};
