import useTranslation from "next-translate/useTranslation";
import { Dialog } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setUnavailableDelivery } from "store/common/commonSlice";
import GreenButton from "../Buttons/GreenButton";
import cls from "./UnavailableDelivery.module.scss";
import { useStyles } from "./styles";

export default function UnavailableDelivery({ setEditAddress }) {
  const dispatch = useDispatch();
  const { t } = useTranslation("common");
  const classes = useStyles();
  const { isUnavailableDelivery } = useSelector((state) => state.common);

  return (
    <Dialog
      className={classes.root}
      open={isUnavailableDelivery}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <div className={cls.dialog}>
        <p>{t("oops")}</p>
        <div
          className={cls.mainTitle}
          dangerouslySetInnerHTML={{
            __html: t(
              "we have not made it to your area yet, but we hope to meet you one day you"
            ),
          }}
        />
        <div className={cls.groupButton}>
          <GreenButton
            fullWidth
            size="medium"
            onClick={() => {
              // dispatch(setUnavailableDelivery(false))
              setEditAddress(true);
            }}
          >
            {t("changeAddress")}
          </GreenButton>
        </div>
      </div>
    </Dialog>
  );
}
