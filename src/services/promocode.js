import { request } from "./http-client";
import { useQuery } from "react-query";
import { requestConstants } from "./constants";
import { format } from "date-fns";

const getPromocodeLogin = async (params, headers) =>
  await request.get("promo-login", {
    params,
    headers: {
      ...headers,
    },
  });

export const usePromocode = ({
  promocodeLoginParamas,
  promoLoginHeaderProps,
  onError = () => {},
} = {}) => {
  const promocodeLogin = useQuery(
    [requestConstants.PROMOCODE_LOGIN],
    () =>
      getPromocodeLogin(
        {
          ...promocodeLoginParamas,
          current_date: format(new Date(), "dd-MM-yyyy"),
        },
        promoLoginHeaderProps
      ),
    { enabled: false, onError }
  );

  return {
    promocodeLogin,
  };
};
