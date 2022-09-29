import { Container } from "@mui/material";
import useTranslation from "next-translate/useTranslation";

import CheckoutForm from "components/UI/CheckoutForm/CheckoutForm";
import cls from "./Checkout.module.scss";

export default function Checkout() {
  const { t } = useTranslation("common");

  return (
    <main className={cls.main}>
      <Container>
        <p className={cls.title}>{t("checkout_order")}</p>
        <CheckoutForm />
      </Container>
    </main>
  );
}
