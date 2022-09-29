import cls from "./NotHereFound.module.scss";
import { Container } from "@mui/material";

export function NotHereFound() {
  return (
    <main className={cls.main}>
      <Container>
        <img src="emptyAddress.gif" alt="empty" />
        <h2>Нас тут еще нет</h2>
        <p>
          Мы добавляем десятки ресторанов каждый день. Возможно, они есть и на
          стороне вашего адреса.
        </p>
      </Container>
    </main>
  );
}
