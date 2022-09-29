import { Dialog } from "@mui/material";
import useTranslation from "next-translate/useTranslation";
import { useEffect } from "react";
import { useRouter } from "next/router";
import GreenButton from "../../Buttons/GreenButton";
import cls from "./OrderSuccessDialog.module.scss";
import { useStyles } from "../styles";

export default function OrderSuccessDialog({ open }) {
  const router = useRouter();
  const classes = useStyles();
  const { t } = useTranslation("common");
  return (
    <Dialog
      className={classes.root}
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <div className={cls.dialog}>
        <p>{t("you have successfully placed an order")}</p>
        <div className={cls.img}>
          <img src="/icons/orderSuccessIcon.png" alt="success img" />
        </div>
        <p className={cls.desc}>
          {t("to track your order, you must go to the current orders page")}
        </p>
        <GreenButton fullWidth size="medium" onClick={() => router.push("/")}>
          {t("return_main_page")}
        </GreenButton>
      </div>
    </Dialog>
  );
}
