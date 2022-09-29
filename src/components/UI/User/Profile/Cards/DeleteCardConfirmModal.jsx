import { Dialog } from "@mui/material";
import useTranslation from "next-translate/useTranslation";
import GreenButton from "components/UI/Buttons/GreenButton";
import GreyButton from "components/UI/Buttons/GreyButton";
import { useDispatch } from "react-redux";
import cls from "./Cards.module.scss";
import { useStyles } from "./styles";

export default function DeleteCardConfirmModal({
  open,
  handleClose,
  confrimFn,
}) {
  const classes = useStyles();
  const { t } = useTranslation("common");

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className={classes.root}
    >
      <div className={cls.dialog}>
        <p>{t("delete_card")}</p>
        <p>{t("are you sure you want to delete the card")}</p>
        <div className={cls.groupButton}>
          <GreyButton fullWidth onClick={handleClose}>
            {t("cancel")}
          </GreyButton>
          <GreenButton
            fullWidth
            onClick={() => {
              confrimFn();
            }}
          >
            {t("confirm")}
          </GreenButton>
        </div>
      </div>
    </Dialog>
  );
}
