import { useEffect } from "react";
import { Popover } from "@mui/material";
import { useGetUser } from "hooks/useGetUser";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useState } from "react";
import { logout } from "utils/userDetails";
import cls from "./Header.module.scss";
import { useStyles } from "./styles";
import { useRouter } from "next/router";
import LogoutConfirmModal from "../LogoutConfirmModal/LogoutConfirmModal";

export default function ProfilePopup({ isMobile = false }) {
  const { t } = useTranslation("common");
  const id = open ? "simple-popover" : undefined;
  const user = useGetUser();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const classes = useStyles();
  const open = Boolean(anchorEl);
  const router = useRouter();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const handleRouteChange = () => {
      handleClose();
    };
    router.events.on("routeChangeStart", handleRouteChange);
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, []);

  return (
    <>
      <div onClick={handleClick} className={cls.profile}>
        {user?.name?.substring(0, 1)}
      </div>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        classes={classes}
      >
        <div className={cls.profilePopup}>
          {!isMobile ? (
            <>
              <Link href="/user/orders">
                <a onClick={handleClose}>{t("my_orders")}</a>
              </Link>
              <Link href="/user">
                <a onClick={handleClose}>{t("personal_data")}</a>
              </Link>
              <Link href="/#">
                <a
                  onClick={() => {
                    handleClose();
                    setOpenModal(true);
                  }}
                >
                  {t("go_out")}
                </a>
              </Link>
            </>
          ) : (
            <>
              <Link href="/user">
                <a>{t("profile")}</a>
              </Link>
              <Link href="/user/favourite">
                <a>{t("favorites")}</a>
              </Link>
              <Link href="/user/cards">
                <a>{t("my_cards")}</a>
              </Link>
              <Link href="/user/address">
                <a>{t("my_address")}</a>
              </Link>
            </>
          )}
        </div>
      </Popover>
      <LogoutConfirmModal
        open={openModal}
        setOpen={setOpenModal}
        logout={logout}
      />
    </>
  );
}
