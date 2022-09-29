import { Dialog, Popover } from "@mui/material";
import useTranslation from "next-translate/useTranslation";
import GreenButton from "../Buttons/GreenButton";
import GreyButton from "../Buttons/GreyButton";

import cls from "./AddAddress.module.scss";

import { useStylesAddress } from "./styles";
import { useWindowWidth } from "hooks/useWindowWidth";

export default function AddressPopopver({
  id,
  user,
  open,
  setEditAddress,
  handleClose,
  openAddAddress,
  isAnotherAddress,
  anchorEl,
}) {
  const classesAddress = useStylesAddress();
  const windowWidth = useWindowWidth();
  const { t } = useTranslation("common");

  return (
    <>
      {windowWidth > 768 ? (
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          {isAnotherAddress ? (
            <div className={cls.addressBox}>
              <p>{t("order to this address")}</p>
              <p className={cls.addressName}>{user?.address?.address}</p>
              <div className={cls.buttons}>
                <GreyButton
                  fullWidth
                  onClick={() => {
                    setEditAddress(true);
                    handleClose();
                  }}
                >
                  {t("no")}
                </GreyButton>
                <GreenButton fullWidth onClick={handleClose}>
                  {t("yes")}
                </GreenButton>
              </div>
            </div>
          ) : (
            <div className={cls.addAddress}>
              <p className={cls.title}>{t("address delivery")}</p>
              <p className={cls.description}>
                {t(
                  "add your address, the list of restaurants will change according to your address"
                )}
              </p>
              <GreenButton
                className={cls.btnAddress}
                onClick={openAddAddress}
                fullWidth
              >
                {t("select street and house")}
              </GreenButton>
            </div>
          )}
        </Popover>
      ) : (
        <Dialog
          className={classesAddress.root}
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          {isAnotherAddress ? (
            <div className={cls.addressBox}>
              <p>{t("order to this address")}</p>
              <p className={cls.addressName}>{user?.address?.address}</p>
              <div className={cls.buttons}>
                <GreyButton
                  fullWidth
                  onClick={() => {
                    setEditAddress(true);
                    handleClose();
                  }}
                >
                  {t("no")}
                </GreyButton>
                <GreenButton fullWidth onClick={handleClose}>
                  {t("yes")}
                </GreenButton>
              </div>
            </div>
          ) : (
            <div className={cls.addAddress}>
              <p className={cls.title}>{t("address delivery")}</p>
              <p className={cls.description}>
                {t(
                  "add your address, the list of restaurants will change according to your address"
                )}
              </p>
              <GreenButton
                className={cls.btnAddress}
                onClick={openAddAddress}
                fullWidth
              >
                {t("select street and house")}
              </GreenButton>
            </div>
          )}
        </Dialog>
      )}
    </>
  );
}
