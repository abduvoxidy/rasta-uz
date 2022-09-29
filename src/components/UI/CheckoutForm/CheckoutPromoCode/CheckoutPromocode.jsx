import useTranslation from "next-translate/useTranslation";
import GreenButton from "../../Buttons/GreenButton";
import Input from "../../Forms/Input";
import { PromocodeIcon } from "../../Icons";
import cls from "./CheckoutPromoCode.module.scss";

export default function CheckoutPromocode({
  confirmPromocode,
  value,
  onChange,
  onBlur,
  errorPromo,
}) {
  const { t } = useTranslation("common");

  return (
    <div className={cls.promocodeBox}>
      <div className={cls.groups}>
        <div className={cls.input}>
          <Input
            isError={errorPromo}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={t("enter_promocode")}
            name="name"
          />
          <span className={cls.error}>
            {errorPromo && t("wrong_promocode")}
          </span>
        </div>
        <div className={cls.btn}>
          <GreenButton
            disabled={!value || confirmPromocode.isSuccess}
            onClick={() => confirmPromocode.refetch()}
            fullWidth
            size="medium"
            loading={confirmPromocode.isLoading}
          >
            {t("send")}
          </GreenButton>
        </div>
      </div>
      {confirmPromocode.data && confirmPromocode.data.id && (
        <div className={cls.promocodeSuccess}>
          <PromocodeIcon />
          {confirmPromocode.data.name.ru}
        </div>
      )}
    </div>
  );
}
