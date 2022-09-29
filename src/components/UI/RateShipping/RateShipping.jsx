import { Dialog } from "@mui/material";
import useTranslation from "next-translate/useTranslation";
import { useEffect, useState } from "react";
import GreenButton from "../Buttons/GreenButton";
import Textarea from "../Forms/Textarea";
import {
  CheckboxIcon,
  DisLikeIcon,
  DisLikeOutlinedIcon,
  LikeIcon,
  LikeOutlinedIcon,
} from "../Icons";
import cls from "./RateShipping.module.scss";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useOrder, useReview } from "services";
import Input from "../Forms/Input";
import { useGetUser } from "hooks/useGetUser";
import { useStyles } from "./styles";

export default function RateShipping() {
  const [open, setOpen] = useState(false);
  const [order, setOrder] = useState(null);
  const [review, setReview] = useState(null);
  const [amount, setAmount] = useState(null);
  const [type, setType] = useState("");
  const user = useGetUser();
  const classes = useStyles();
  const { t, lang } = useTranslation("common");
  const [comment, setComment] = useState("");
  const {
    reviews,
    createMutation,
    orderReviewSeenMutation,
    orderPayTipMutation,
  } = useReview({
    reviewParams: {
      limit: 100,
      page: 1,
      user_id: user?.id,
    },
    orderPayTipMutationProps: {
      onSuccess: () => {
        setOrder(null);
        setOpen(false);
      },
    },
    orderReviewSeenMutationProps: {
      onSuccess: () => {},
    },
    createMutationProps: {
      onSuccess: () => {
        if (order.payment_type !== "cash" && amount) {
          orderPayTipMutation.mutate({
            order_id: order.id,
            amount,
          });
        } else {
          setOpen(false);
          setOrder(null);
        }
      },
    },
  });

  const { orders } = useOrder({
    orderParams: {
      page: 1,
      limit: 5,
      review_seen: false,
      status_ids:
        "79413606-a56f-45ed-97c3-f3f18e645972,e665273d-5415-4243-a329-aee410e39465",
      customer_id: user?.id,
    },
  });

  useEffect(() => {
    if (orders.data && orders.data?.orders?.length > 0) {
      setOpen(true);
      setOrder(orders.data.orders[orders.data.orders.length - 1]);
    }
  }, [orders.data]);

  useEffect(() => {
    if (user && order && user.id) {
      orderReviewSeenMutation.mutate({
        user_id: user.id,
        seen: true,
        order_id: orders.data.orders[orders.data.orders.length - 1].id,
      });
    }
  }, [order, user]);

  const handleClose = () => {
    setOpen(false);
  };

  const confirmReview = () => {
    if (type) {
      createMutation.mutate({
        branch_id: order.steps[0].branch_id,
        branch_name: order.steps[0].branch_name,
        client_id: order.client_id,
        client_name: order.client_name,
        client_phone: order.client_phone_number,
        courier_id: order.courier_id,
        courier_name: order.courier.first_name,
        lang: "ru",
        order_num: order.external_order_id,
        related_subject: review ? review.related_subject : "",
        review_id: review ? review.id : "review",
        review_message: `${review ? review.message[lang] : ""} ${comment}`,
        type,
      });
    } else {
      setOpen(false);
    }
  };

  return (
    <Dialog className={classes.root} open={open} onClose={handleClose}>
      <PerfectScrollbar>
        <div
          className={`${cls.rateBox} ${
            type === "like" || type === "dislike" ? cls.rateAnimation : ""
          }`}
        >
          <p className={cls.title}>Оцените доставку</p>
          <div className={cls.types}>
            <span onClick={() => setType("like")}>
              {type === "like" ? <LikeIcon /> : <LikeOutlinedIcon />}
            </span>
            <span onClick={() => setType("dislike")}>
              {type === "dislike" ? <DisLikeIcon /> : <DisLikeOutlinedIcon />}
            </span>
          </div>
          <div className={cls.box}>
            <div className={cls.list}>
              {reviews?.data?.reviews
                ?.filter((value) => value.type === type)
                ?.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setReview(item)}
                    className={cls.item}
                  >
                    <p>{item.message && item.message[lang]}</p>
                    {review && review.id === item.id ? (
                      <CheckboxIcon />
                    ) : (
                      <div />
                    )}
                  </div>
                ))}
            </div>
            {order && order.payment_type !== "cash" && (
              <>
                <p className={cls.tipTitle}>{t("choose_tip")}</p>
                <div className={cls.chooseTip}>
                  <div
                    className={`${cls.price} ${
                      amount === "other" ? cls.active : ""
                    }`}
                    onClick={() => setAmount("other")}
                  >
                    {t("other_soum")}
                  </div>
                  <div
                    className={`${cls.price} ${
                      amount === 2000 ? cls.active : ""
                    }`}
                    onClick={() => setAmount(2000)}
                  >
                    2 000 {t("soum")}
                  </div>
                  <div
                    className={`${cls.price} ${
                      amount === 5000 ? cls.active : ""
                    }`}
                    onClick={() => setAmount(5000)}
                  >
                    5 000 {t("soum")}
                  </div>
                  <div
                    className={`${cls.price} ${
                      amount === 10000 ? cls.active : ""
                    }`}
                    onClick={() => setAmount(10000)}
                  >
                    10 000 {t("soum")}
                  </div>
                  <div
                    className={`${cls.price} ${
                      amount === 20000 ? cls.active : ""
                    }`}
                    onClick={() => setAmount(20000)}
                  >
                    20 000 {t("soum")}
                  </div>
                </div>
                {amount === "other" && (
                  <div className={cls.input}>
                    <Input
                      type="number"
                      fullWidth
                      placeholder="Введите сумму"
                    />
                  </div>
                )}
              </>
            )}
            <div className={cls.comment}>
              <p className={cls.tipTitle}>{t("leave_comment")}</p>
              <Textarea
                onChange={(e) => setComment(e.target.value)}
                value={comment}
                fullWidth
              />
            </div>
          </div>
          <GreenButton fullWidth onClick={confirmReview}>
            {t("confirm")}
          </GreenButton>
        </div>
      </PerfectScrollbar>
    </Dialog>
  );
}
