import { Dialog } from "@mui/material";
import useTranslation from "next-translate/useTranslation";
import { useDispatch } from "react-redux";
import { clear } from "store/cart/cartSlice";
import GreenButton from "../Buttons/GreenButton";
import GreyButton from "../Buttons/GreyButton";
import cls from "./Cart.module.scss";

export default function CartClearModal({ open = false, setOpen }) {
  const dispatch = useDispatch();
  const { t } = useTranslation("common");

  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <div className={cls.dialog}>
        <p> {t("remove everything from cart")}</p>
        <p> {t("all your selected dishes will be deleted")}</p>
        <div className={cls.groupButton}>
          <GreyButton fullWidth onClick={() => setOpen(false)}>
            {t("no")}
          </GreyButton>
          <GreenButton
            fullWidth
            onClick={() => {
              dispatch(clear());
              setOpen(false);
            }}
          >
            {t("yes")}
          </GreenButton>
        </div>
      </div>
    </Dialog>
  );
}
