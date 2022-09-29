import cls from "./Register.module.scss";
import { useRouter } from "next/router";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useState } from "react";
import useTranslation from "next-translate/useTranslation";
import GreenButton from "components/UI/Buttons/GreenButton";
import Input from "components/UI/Forms/Input";
import { CloseIcon } from "components/UI/Icons";
import { useAuth } from "services";
import formatCodeExpireDuration from "utils/formatCodeExpireDuration";
import { getUserLastOrder, saveUser } from "utils/userDetails";
import InputMask from "components/UI/Forms/InputMask";
import { replaceAll } from "utils/commonUtils";
import useCodeExpire from "hooks/useCodeExpire";

export default function Register() {
  const router = useRouter();
  const [isConfirm, setIsConfirm] = useState(false);
  const [seconds, setSeconds] = useState(60);
  const [expired, setExpired] = useState(false);
  const { t } = useTranslation("common");

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    control,
    setError,
  } = useForm({
    defaultValues: {
      name: "",
      phone: "",
      code: "",
    },
  });

  const { createCustomerMutation, confirmRegisterMutation } = useAuth({
    createCustomerMutationProps: {
      onSuccess: () => {
        setIsConfirm(true);
      },
      onError: () => {
        setError("phone", { message: t("number_registered") });
      },
    },
    confirmRegisterProps: {
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

  useCodeExpire({
    seconds,
    setExpired,
    isConfirm,
    setSeconds,
  });

  const onSubmit = (data) => {
    if (data.phone.length < 17) {
      setError("phone", { message: t("not_enough_numbers") });
      return;
    }
    createCustomerMutation.mutate({
      ...data,
      phone: replaceAll(data.phone),
      registration_source: process.env.SOURCE,
    });
  };

  const sendCode = (value) => {
    if (value.code.length < 6) {
      setError("code", { message: t("not_enough_code") });
      return;
    }
    confirmRegisterMutation.mutate({
      code: value.code,
      phone: replaceAll(watch("phone")),
    });
  };

  const reSendCode = () => {
    if (expired) {
      setExpired(false);
      setSeconds(60);
      createCustomerMutation.mutate({
        phone: replaceAll(watch("phone")),
        name: watch("name"),
        registration_source: process.env.SOURCE,
      });
    }
  };

  return (
    <div className={cls.login}>
      <div className={cls.box}>
        <div className={cls.close} onClick={() => router.push("/")}>
          <CloseIcon />
        </div>
        <form onSubmit={handleSubmit(isConfirm ? sendCode : onSubmit)}>
          <h1>{t("registration")}</h1>
          {isConfirm ? (
            <>
              <div className={cls.input}>
                <label>{t("sms_code")}</label>
                <InputMask
                  mask="999999"
                  placeholder={t("enter_code")}
                  control={control}
                  errors={errors}
                  name="code"
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
            <>
              <div className={cls.input}>
                <label>{t("full_name")}</label>
                <Input
                  placeholder={t("enter_name")}
                  name="name"
                  register={register}
                  errors={errors}
                  required
                />
              </div>
              <div className={cls.input}>
                <label>Номер телефона</label>
                <InputMask
                  mask={`+\\9\\9\\8 99 999 99 99`}
                  placeholder={t("enter_number")}
                  control={control}
                  errors={errors}
                  name="phone"
                  required
                />
              </div>
            </>
          )}
          <GreenButton
            type="submit"
            loading={
              createCustomerMutation.isLoading ||
              confirmRegisterMutation.isLoading
            }
            size="medium"
            className={cls.button}
            fullWidth
            disabled={expired}
          >
            {isConfirm ? t("confirm") : t("registering")}
          </GreenButton>
        </form>
        <div className={cls.register}>
          {t("do you have account")} &nbsp;&nbsp;
          <Link href="/login">
            <a>{t("sign_in")}</a>
          </Link>
        </div>
      </div>
    </div>
  );
}
