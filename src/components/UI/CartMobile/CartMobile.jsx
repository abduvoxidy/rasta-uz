import { Dialog } from "@mui/material";
import { format } from "date-fns";
import useTranslation from "next-translate/useTranslation";
import Image from "next/image";
import useGeolocation from "hooks/useGeolocation";
import { useGetUser } from "hooks/useGetUser";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFare } from "services";
import {
  acceptClearCart,
  closeModal,
  decrement,
  increment,
  setProduct,
  totalPriceProducts,
} from "store/cart/cartSlice";
import numberToPrice from "utils/numberToPrice";
import GreenButton from "../Buttons/GreenButton";
import GreyButton from "../Buttons/GreyButton";
import { DeleteIcon, EmptyCartIcon } from "../Icons";
import cls from "./CartMobile.module.scss";
import CartButton from "./CartButton";
import CartClearModal from "./CartClearModal";
import { useStyles } from "./styles";

export default function CartMobile({ deliveryTime }) {
  const router = useRouter();
  const classes = useStyles();
  const { cartItems, isVisible, product } = useSelector((state) => state.cart);
  const user = useGetUser();
  const { branchId } = useSelector((state) => state.common);
  const [coDeliverPrice, setDeliveryPrice] = useState(0);
  const location = useGeolocation();
  const { deliveryPrice } = useFare({
    deliveryPriceMutationProps: {
      onSuccess: (res) => {
        setDeliveryPrice(res.price);
      },
    },
  });
  const { t, lang } = useTranslation("common");

  const totalPrice = totalPriceProducts();
  useEffect(() => {
    if (branchId)
      deliveryPrice.mutate({
        branch_id: branchId,
        date_time: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        lat: user?.address?.location?.lat || location.lat,
        long: user?.address?.location?.long || location.long,
      });
  }, [location, branchId]);

  const dispatch = useDispatch();
  const [open, setOpen] = useState();

  return (
    <>
      <div className={cls.root}>
        <h2>{t("basket")}</h2>

        <div className={cls.box}>
          <div className={cls.cart}>
            <div className={cls.header}>
              {cartItems.length > 0 && (
                <div
                  className={cls.delete}
                  onClick={() => {
                    setOpen(true);
                  }}
                >
                  <DeleteIcon />
                </div>
              )}
            </div>
            {cartItems.length > 0 ? (
              <div className={`${cls.scrollBar} scrollBar`}>
                <div className={cls.body}>
                  {cartItems.map((item) => (
                    <div className={cls.item} key={item.productOptionId}>
                      <div className={cls.img}>
                        <Image
                          src={item?.image}
                          layout="fill"
                          objectFit="cover"
                        />
                      </div>
                      <div className={cls.productInfo}>
                        <p>{item.name && item.name[lang]}</p>
                        <p className={cls.ingredient}>
                          {item.option?.name && item.option?.name[lang]}{" "}
                        </p>

                        {item.option?.child_options.map((item) => (
                          <p className={cls.ingredient}>
                            {item?.name && item?.name[lang]}
                          </p>
                        ))}

                        <p>
                          {numberToPrice(
                            item.quantity * item.totalPrice,
                            t("soum")
                          )}
                        </p>
                      </div>
                      <div className={cls.countBtn}>
                        <CartButton
                          size={32}
                          increment={() => {
                            dispatch(increment(item.productOptionId));
                          }}
                          decrement={() => {
                            dispatch(decrement(item.productOptionId));
                          }}
                          count={item.quantity}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className={cls.emptyCart}>
                <EmptyCartIcon />
                <p>{t("select_dishes_to_order")}</p>
              </div>
            )}
            <div className={`${cls.info} ${cls.deliveryTime}`}>
              <span>{t("delivery_time")}</span>
              <span>
                {deliveryTime} {t("minute")}
              </span>
            </div>
          </div>

          <div className={cls.totalSum}>
            {cartItems.length > 0 && (
              <>
                <div className={cls.info}>
                  <span>{t("delivery_amount")}</span>
                  <span>{numberToPrice(coDeliverPrice, t("soum"))}</span>
                </div>
                <div className={cls.info}>
                  <span>{t("total_amount")}</span>
                  <span>
                    {numberToPrice(totalPrice + coDeliverPrice, t("soum"))}
                  </span>
                </div>
              </>
            )}
            <div className={cls.button}>
              <GreenButton
                disabled={!cartItems.length > 0}
                fullWidth
                onClick={() => router.push("/checkout")}
                size="medium"
              >
                {t("checkout_order")}
              </GreenButton>
            </div>
          </div>
        </div>
      </div>

      <Dialog
        open={isVisible}
        onClose={() => {
          dispatch(closeModal());
        }}
        className={classes.root}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div className={cls.dialog}>
          <p>{t("you cannot add the product to your shopping cart")}</p>
          <p>
            {t(
              "all previously added dishes from another restaurant will be removed from basket"
            )}
          </p>
          <div className={cls.groupButton}>
            <GreyButton fullWidth onClick={() => dispatch(closeModal())}>
              {t("cancel")}
            </GreyButton>
            <GreenButton
              fullWidth
              onClick={async () => {
                await dispatch(acceptClearCart());
                dispatch(setProduct(product));
              }}
            >
              {t("continue")}
            </GreenButton>
          </div>
        </div>
      </Dialog>

      <CartClearModal open={open} setOpen={setOpen} />
    </>
  );
}
