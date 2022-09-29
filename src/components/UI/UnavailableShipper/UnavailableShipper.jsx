import { Dialog } from "@mui/material";
import useTranslation from "next-translate/useTranslation";
import { useDispatch, useSelector } from "react-redux";
import { clear } from "store/cart/cartSlice";
import { setUnavailableShipper } from "store/common/commonSlice";
import GreenButton from "../Buttons/GreenButton";
import cls from "./UnavailableShipper.module.scss";

export default function UnavailableShipper() {
  const dispatch = useDispatch();
  const { t } = useTranslation("common");
  const { isUnavailableShipper } = useSelector((state) => state.common);

  return (
    <Dialog
      open={isUnavailableShipper}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      onClose={() => {
        dispatch(setUnavailableShipper(false));
      }}
    >
      <div className={cls.dialog}>
        <p>{t("attention! the restaurant is blocked")}</p>
        <p>
          {t(
            "at the moment the restaurant is closed, you can not place an order,empty the trash"
          )}
        </p>
        <div className={cls.groupButton}>
          <GreenButton
            fullWidth
            size="medium"
            onClick={() => {
              dispatch(clear());
              dispatch(setUnavailableShipper(false));
            }}
          >
            {t("clear_basket")}
          </GreenButton>
        </div>
      </div>
    </Dialog>
  );
}
