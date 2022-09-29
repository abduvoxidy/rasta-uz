import { useState } from "react";
import useTranslation from "next-translate/useTranslation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Dialog } from "@mui/material";
import GreenButton from "components/UI/Buttons/GreenButton";
import InputMask from "components/UI/Forms/InputMask";
import { CloseIcon } from "components/UI/Icons";
import cls from "./Cards.module.scss";
import { useStyles } from "./styles";
import { usePaymentCard } from "services";

import useCodeExpire from "hooks/useCodeExpire";
import { useGetUser } from "hooks/useGetUser";
import formatCodeExpireDuration from "utils/formatCodeExpireDuration";

export default function AddCard({ open, setOpen, refetch }) {
  const [smsSend, setSmsSend] = useState(false);
  const [cardId, setCardId] = useState(null);
  const [expired, setExpired] = useState(false);
  const [resend, setResend] = useState(false);
  const [seconds, setSeconds] = useState(119);
  const [state, setState] = useState({});
  const user = useGetUser();
  const classes = useStyles();
  const { t } = useTranslation("common");
  const { createMutation, confirmSmsMutation } = usePaymentCard({
    createMutationProps: {
      onSuccess: (res) => {
        setSmsSend(true);
        setCardId(res.id);
        reset({ card_num: "", card_expire_date: "" });
      },
      onError: () => {
        [
          {
            name: "card_num",
            message: t("wrong_card_number"),
          },
          {
            name: "card_expire_date",
            message: t("wrong_card_expired_date"),
          },
        ].forEach(({ name, message }) => setError(name, { message }));
      },
    },
    confirmSmsMutationProps: {
      onSuccess: () => {
        setOpen(false);
        setSmsSend(false);
        setResend(false);
        toast.success(t("card_added_successfully"));
        refetch();
      },
      onError: () => {
        setError("sms_code", { message: t("wrong_code") });
      },
    },
  });

  const {
    handleSubmit,
    reset,
    watch,
    control,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      card_num: "",
      card_expire_date: "",
      sms_code: "",
    },
  });

  const onSubmit = (data) => {
    if (data.card_num.length < 19) {
      setError("card_num", { message: t("not_enough_numbers") });
      return;
    }

    createMutation.mutate({
      card_expire_date: data.card_expire_date,
      card_num: data.card_num,
      user_id: user.id,
    });
    setState(data);
  };

  const confirmSms = (data) => {
    confirmSmsMutation.mutate({
      card_id: cardId,
      sms_code: data.sms_code,
      user_id: user.id,
    });
  };

  useCodeExpire({
    seconds,
    setExpired,
    isConfirm: smsSend,
    setSeconds,
  });

  const reSendCode = () => {
    if (expired) {
      setExpired(false);
      setSeconds(119);
      setResend(true);
      createMutation.mutate({
        card_expire_date: state.card_expire_date,
        card_num: state.card_num,
        user_id: user.id,
      });
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSmsSend(false);
    setResend(false);
    reset({ card_num: "", card_expire_date: "", sms_code: "" });
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      className={classes.root}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <form onSubmit={handleSubmit(smsSend || resend ? confirmSms : onSubmit)}>
        <div className={cls.cardBox}>
          <div className={cls.close} onClick={handleClose}>
            <CloseIcon />
          </div>
          <p>{t("add_card")}</p>
          {!smsSend ? (
            <>
              <div className={cls.input}>
                <label>{t("card_number")}</label>
                <InputMask
                  mask="9999 9999 9999 9999"
                  placeholder={t("enter_card")}
                  control={control}
                  name="card_num"
                  errors={errors}
                  required
                  minLength={19}
                  message={t("invalid_card_number")}
                />
              </div>
              <div className={cls.input}>
                <label>{t("card_term")}</label>
                <InputMask
                  mask="99/99"
                  placeholder={t("mm-yy")}
                  control={control}
                  name="card_expire_date"
                  errors={errors}
                  required
                />
              </div>
            </>
          ) : (
            <>
              <div className={cls.input}>
                <label>{t("sms_code")}</label>
                <InputMask
                  mask="999999"
                  placeholder={t("enter_code_confirm")}
                  control={control}
                  name="sms_code"
                  errors={errors}
                  required
                />
              </div>
              <div className={cls.reSendCode} onClick={reSendCode}>
                {expired
                  ? t("send_code_again")
                  : formatCodeExpireDuration(seconds)}
              </div>
            </>
          )}
          <GreenButton
            className={cls.greenBtn}
            loading={confirmSmsMutation.isLoading || createMutation.isLoading}
            type="submit"
            size="medium"
            disabled={expired}
            fullWidth
          >
            {!smsSend ? t("continue") : t("confirm")}
          </GreenButton>
        </div>
      </form>
    </Dialog>
  );
}
