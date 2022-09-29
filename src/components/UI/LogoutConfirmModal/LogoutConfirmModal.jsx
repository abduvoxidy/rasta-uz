import { useState } from "react";
import { Dialog } from "@mui/material";
import useTranslation from "next-translate/useTranslation";
import GreenButton from "components/UI/Buttons/GreenButton";
import GreyButton from "components/UI/Buttons/GreyButton";
import cls from "./LogoutConfirmModal.module.scss";
import { useStyles } from "./styles";

export default function LogoutConfirmModal({
  open = false,
  setOpen,
  logout = () => {},
}) {
  const classes = useStyles();
  const [isLoading, setIsloading] = useState(false);
  const { t } = useTranslation("common");

  return (
    <>
      {open && (
        <Dialog
          className={classes.root}
          open={open}
          onClose={() => {
            setOpen(null);
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <div className={cls.dialog}>
            <p>{t("logout_confirm")}</p>
            <div className={cls.groupButton}>
              <GreyButton fullWidth onClick={() => setOpen(null)}>
                {t("cancel")}
              </GreyButton>
              <GreenButton
                loading={isLoading}
                fullWidth
                onClick={() => {
                  setIsloading(true);
                  logout();
                }}
              >
                {t("confirm")}
              </GreenButton>
            </div>
          </div>
        </Dialog>
      )}
    </>
  );
}
