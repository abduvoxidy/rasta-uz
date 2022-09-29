import cls from "./CheckoutCard.module.scss";
import { useState } from "react";
import { useSelector } from "react-redux";
import { DeleteIcon } from "../../Icons";
import CartClearModal from "../../Cart/CartClearModal";

export default function CheckoutCard({
  children,
  title,
  isDelete = false,
  scrollRef,
}) {
  const { cartItems } = useSelector((state) => state.cart);
  const [open, setOpen] = useState();

  return (
    <>
      <div className={cls.card} ref={scrollRef}>
        <p className={cls.title}>{title}</p>
        {isDelete && cartItems.length > 0 && (
          <div
            className={cls.delete}
            onClick={() => {
              setOpen(true);
            }}
          >
            <DeleteIcon />
          </div>
        )}
        {children}
      </div>
      <CartClearModal open={open} setOpen={setOpen} />
    </>
  );
}
