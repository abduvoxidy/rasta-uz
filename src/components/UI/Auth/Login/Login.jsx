import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import cls from "./Login.module.scss";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useAuth } from "services";
import { getUserLastOrder, saveUser } from "utils/userDetails";
import { useState } from "react";
import formatCodeExpireDuration from "utils/formatCodeExpireDuration";
import InputMask from "components/UI/Forms/InputMask";
import GreenButton from "components/UI/Buttons/GreenButton";
import { CloseIcon } from "components/UI/Icons";
import { replaceAll } from "utils/commonUtils";
import useCodeExpire from "hooks/useCodeExpire";

export default function Login() {
  const router = useRouter();
  const [isConfirm, setIsConfirm] = useState(false);
  const [seconds, setSeconds] = useState(60);
  const [expired, setExpired] = useState(false);
  const { t } = useTranslation("common");
  const {
    handleSubmit,
    watch,
    control,
    formState: { errors },
    setError,
  } = useForm({
    defaultValues: {
      phone: "",
      code: "",
    },
  });

  const { loginMutation, confirmLoginMutation } = useAuth({
    loginMutationProps: {
      onSuccess: () => {
        setIsConfirm(true);
      },
      onError: () => {
        setError("phone", { message: t("number_unregistered") });
      },
    },
    confirmLoginProps: {
      onSuccess: (data) => {
        saveUser(data);
        getUserLastOrder();
        setTimeout(() => {
          location.replace("/");
        }, 2000);
      },
      onError: (err) => {
        [
          {
            name: "code",
            message: t("wrong_code"),
          },
        ].forEach(({ name, message }) => setError(name, { message }));
      },
    },
  });

  const onSubmit = (data) => {
    if (data.phone.length < 17) {
      setError("phone", { message: t("not_enough_numbers") });
      return;
    }
    loginMutation.mutate({
      ...data,
      phone: replaceAll(data.phone),
    });
  };

  const sendCode = (value) => {
    if (value.code.length < 6) {
      setError("code", { message: t("not_enough_code") });
      return;
    }
    confirmLoginMutation.mutate({
      code: value.code,
      phone: replaceAll(watch("phone")),
    });
  };

  useCodeExpire({
    seconds,
    setExpired,
    isConfirm,
    setSeconds,
  });

  const reSendCode = () => {
    if (expired) {
      setExpired(false);
      setSeconds(60);
      loginMutation.mutate({
        phone: replaceAll(watch("phone")),
      });
    }
  };

  return (
    <div className={cls.login}>
      <div className={cls.box}>
        <div className={cls.close} onClick={() => router.push("/")}>
          <CloseIcon />
        </div>
        <h1>{t("sign_in")}</h1>
        <p>{t("sign in with your phone number")}</p>
        <form onSubmit={handleSubmit(isConfirm ? sendCode : onSubmit)}>
          <div className={cls.input}>
            <label>{t("phone_number")}</label>
            <InputMask
              mask={`+\\9\\9\\8 99 999 99 99`}
              placeholder={t("enter_number")}
              control={control}
              disabled={isConfirm}
              name="phone"
              errors={errors}
              required
            />
          </div>
          {isConfirm ? (
            <>
              <div className={cls.input}>
                <label>{t("sms_code")}</label>
                <InputMask
                  mask="999999"
                  placeholder={t("enter_code")}
                  control={control}
                  name="code"
                  errors={errors}
                  required
                />
              </div>
              <div className={cls.timer} onClick={reSendCode}>
                {expired
                  ? t("send_code_again")
                  : formatCodeExpireDuration(seconds)}
              </div>
            </>
          ) : (
            <></>
          )}

          <GreenButton
            className={cls.button}
            type="submit"
            fullWidth
            size="medium"
            disabled={expired}
            loading={loginMutation.isLoading || confirmLoginMutation.isLoading}
          >
            {isConfirm ? t("confirm") : t("come_in")}
          </GreenButton>
        </form>
        <div className={cls.register}>
          {t("dont_have_account")} &nbsp;&nbsp;{" "}
          <Link href="/register">
            <a>{t("registration")}</a>
          </Link>
        </div>
      </div>
    </div>
  );
}
