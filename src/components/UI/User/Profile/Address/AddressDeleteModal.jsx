import { Dialog } from "@mui/material";
import useTranslation from "next-translate/useTranslation";
import GreenButton from "components/UI/Buttons/GreenButton";
import GreyButton from "components/UI/Buttons/GreyButton";
import cls from "./Address.module.scss";
import { useStyles } from "./styles";

export default function AddressDeleteModal({ open, setOpen, deleteAddress }) {
  const classes = useStyles();
  const { t } = useTranslation("common");

  return (
    <Dialog
      className={classes.root}
      open={!!open}
      onClose={() => {
        setOpen(false);
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <div className={cls.dialog}>
        <p>{t("delete_address")}</p>
        <p>{t("are you sure you want to delete the address")}</p>
        <div className={cls.groupButton}>
          <GreyButton fullWidth onClick={() => setOpen(false)}>
            {t("cancel")}
          </GreyButton>
          <GreenButton
            loading={deleteAddress.isLoading}
            fullWidth
            onClick={() => {
              deleteAddress.mutate(open);
            }}
          >
            {t("confirm")}
          </GreenButton>
        </div>
      </div>
    </Dialog>
  );
}
