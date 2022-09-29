import { useGetUser } from "hooks/useGetUser";
import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useBranch, useOrder } from "services";
import Textarea from "../Forms/Textarea";
import CheckoutAddress from "./CheckoutAddress/CheckoutAddress";
import CheckoutCard from "./CheckoutCard/CheckoutCard";
import cls from "./CheckoutForm.module.scss";
import CheckoutPayment from "./CheckoutPayment/CheckoutPayment";
import CheckoutPriceInfo from "./CheckoutPriceInfo/CheckoutPriceInfo";
import CheckoutProductOptions from "./CheckoutProductOptions";
import CheckoutProducts from "./CheckoutProducts/CheckoutProducts";
import { clear, totalPriceProducts } from "store/cart/cartSlice";
import OrderSuccessDialog from "./OrderSuccessDialog/OrderSuccessDialog";
import CheckoutPromocode from "./CheckoutPromoCode/CheckoutPromocode";
import { usePromocode } from "services";
import PromoSuccess from "./PromoSuccess";
import PayCardLoading from "./PayCardLoading";
import toast from "react-hot-toast";
import useTranslation from "next-translate/useTranslation";

export default function CheckoutForm() {
  const user = useGetUser();
  const scrollRef = useRef();
  const { t } = useTranslation("common");
  const [deliveryPriceSum, setDeliveryPrice] = useState(0);
  const { regionId, branchId } = useSelector((state) => state.common);
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [branch, setBranch] = useState(null);
  const [open, setOpen] = useState(false);
  const totalPrice = totalPriceProducts();
  const [promoSuccess, setPromoSuccess] = useState(false);
  const [errorPromo, setErrorPromo] = useState(false);
  const [checkedPayment, setCheckedPayment] = useState(true);
  const [state, setState] = useState({
    description: "",
    paymentType: "",
    deliveryType: "delivery",
    promoLogin: "",
  });

  const { promocodeLogin } = usePromocode({
    promocodeLoginParamas: {
      promo_login: state.promoLogin,
      product_ids: cartItems.map((item) => item.id).join(","),
      sum: totalPrice,
    },
    promoLoginHeaderProps: {
      Shipper: cartItems.length > 0 ? cartItems[0]?.shipper_id : null,
    },
    onError: () => {
      setErrorPromo(true);
    },
  });

  const { nearestBranch } = useBranch({
    nearesBranchParams: {
      region_id: regionId,
      shipper_id: cartItems.length > 0 && cartItems[0].shipper_id,
      lat: user?.address?.location?.lat,
      long: user?.address?.location?.long,
    },
  });

  useEffect(() => {
    if (state.deliveryType === "self-pickup" && state.paymentType === "cash") {
      setState((prev) => ({
        ...prev,
        paymentType: "",
      }));
    }
  }, [state.deliveryType]);

  useEffect(() => {
    if (nearestBranch?.data?.branches[0]?.id) {
      setBranch(nearestBranch.data.branches[0]);
    }
  }, [nearestBranch.data]);

  useEffect(() => {
    if (promocodeLogin.data && promocodeLogin.status === "success") {
      setPromoSuccess(true);
      setTimeout(() => {
        setPromoSuccess(false);
      }, 2500);
    }
  }, [promocodeLogin.data]);

  const { createMutation, createByCard } = useOrder({
    createMutationProps: {
      onSuccess: (res) => {
        if (state.paymentType?.hasOwnProperty("card_id")) {
          createByCard.mutate(res.order_id);
        } else {
          dispatch(clear());
          setOpen(true);
        }
      },
    },
    createMutationParams: {
      shipper_id: cartItems.length > 0 ? cartItems[0].shipper_id : null,
    },
    createByCardProps: {
      onSuccess: (res) => {
        dispatch(clear());
        setOpen(true);
      },
    },
  });

  const formatOption = (productOption) => {
    let option = productOption ? { ...productOption } : {};
    if (option) {
      delete option.is_default;
      if (option.child_options) {
        const childOptions = [...option.child_options];
        option.child_options = childOptions.map((item) => {
          return {
            discount_type: item.discount_type,
            discount_value: item.discount_value,
            id: item.id,
            is_required: item.is_required,
            name: item.name,
            parent_id: item.parent_id,
            price: item.price,
            product_id: item.product_id,
          };
        });
      }
    }
    return option;
  };

  const confirmOrder = () => {
    if (!state.paymentType) {
      setCheckedPayment(false);
      checkedPayment && toast.error(t("choose payment type"));
      window.scrollTo({
        behavior: "smooth",
        top: scrollRef.current.offsetTop - 80,
      });
      return;
    }

    let deliveryDiscount = {
      delivery_discount_value: 0,
      delivery_discount_type: "",
      delivery_discount_promotion_id: "",
      delivery_discount_promotion_rasta_share: 0,
    };
    let promocode = {};
    if (promocodeLogin.data && promocodeLogin.data.id) {
      if (
        promocodeLogin.data &&
        promocodeLogin.data.expense_type === "product"
      ) {
        promocode = {
          discount_promotion_id: promocodeLogin.data.id,
          discount_promotion_rasta_share: promocodeLogin.data.rasta_share,
          discount_type: promocodeLogin.data.discount_type,
          discount_value: promocodeLogin.data.discount_value,
        };
      } else {
        deliveryDiscount = {
          delivery_discount_value: promocodeLogin.data.discount_value,
          delivery_discount_type: promocodeLogin.data.discount_type,
          delivery_discount_promotion_id: promocodeLogin.data.id,
          delivery_discount_promotion_rasta_share:
            promocodeLogin.data.rasta_share,
        };
      }
    }

    createMutation.mutate({
      apartment: user.address.apartment,
      building: user.address.building,
      card_id: state.paymentType.card_id,
      card_num: state.paymentType.card_num,
      client_id: user.id,
      co_delivery_price: deliveryPriceSum,
      ...deliveryDiscount,
      delivery_time: null,
      delivery_type: state.deliveryType,
      description: state.description,
      extra_phone_number: null,
      floor: user.address.floor,
      future_time: "",
      is_courier_call: true,
      paid: false,
      payment_type: state.paymentType === "cash" ? "cash" : "payme",
      region_id: regionId,
      source: process.env.SOURCE,
      status_id: "ccb62ffb-f0e1-472e-bf32-d130bea90617",
      steps: [
        {
          branch_id: branch.id,
          description: state.description,
          products: cartItems.map((item) => ({
            description: item.description,
            discount_promotion_id: item.discount_promotion_id,
            discount_promotion_rasta_share: item.discount_promotion_rasta_share,
            discount_type: item.discount_type,
            discount_value: item.discount_value,
            ...promocode,
            name: item.name,
            option: formatOption(item.option),
            product_id: item.id,
            price: String(item.price_with_option),
            quantity: item.quantity,
            total_amount_without_rasta_discounts:
              item.total_amount_without_rasta_discounts,
          })),
        },
      ],
      to_address: user.address.address,
      to_location: {
        lat: user.address.location.lat,
        long: user.address.location.long,
      },
    });
  };

  return (
    <>
      <div className={cls.checkoutBox}>
        <div className={cls.leftSide}>
          <CheckoutCard title={t("address delivery")}>
            <CheckoutAddress
              user={user}
              setDeliveryType={(value) => {
                setState((prev) => ({
                  ...prev,
                  deliveryType: value,
                }));
              }}
              deliveryType={state.deliveryType}
              nearestBranch={nearestBranch}
              branch={branch}
              setBranch={setBranch}
            />
          </CheckoutCard>

          <CheckoutCard title={t("payment")} scrollRef={scrollRef}>
            <CheckoutPayment
              user={user}
              setPaymentType={(value) => {
                setState((prev) => ({
                  ...prev,
                  paymentType: value,
                }));
              }}
              setCheckedPayment={setCheckedPayment}
              checkedPayment={checkedPayment}
              deliveryType={state.deliveryType}
              paymentType={state.paymentType}
            />
          </CheckoutCard>

          <CheckoutCard title={t("promo_code")}>
            <CheckoutPromocode
              value={state.promoLogin}
              errorPromo={errorPromo}
              onChange={(e) => {
                setState((prev) => ({
                  ...prev,
                  promoLogin: e.target.value,
                }));
                setErrorPromo(false);
              }}
              onBlur={() => setErrorPromo(false)}
              confirmPromocode={promocodeLogin}
            />
          </CheckoutCard>
          <CheckoutCard title={t("your_order")} isDelete>
            <CheckoutProducts cartItems={cartItems} />
          </CheckoutCard>
          <CheckoutCard title={t("order_note")}>
            <Textarea
              onChange={(e) => {
                setState((prev) => ({
                  ...prev,
                  description: e.target.value,
                }));
              }}
              className={cls.textareaOrder}
              placeholder={t("enter_comment")}
            />
          </CheckoutCard>

          <CheckoutProductOptions
            branchId={branchId}
            productIds={cartItems.map((item) => item.id).join(",")}
          />
        </div>
        <div className={cls.rightSide}>
          <CheckoutPriceInfo
            confirmOrder={confirmOrder}
            setDeliveryPrice={setDeliveryPrice}
            deliveryPriceSum={deliveryPriceSum}
            setState={setState}
            state={state}
            promocodeLogin={promocodeLogin}
            loading={createMutation.isLoading}
            branchId={branch?.id}
          />
        </div>
      </div>
      {open && <OrderSuccessDialog open={open} setOpen={setOpen} />}
      {promoSuccess && <PromoSuccess />}
      {createByCard.isLoading && <PayCardLoading />}
    </>
  );
}
