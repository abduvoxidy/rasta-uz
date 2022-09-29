import React, { useState, useEffect } from "react";
import useTranslation from "next-translate/useTranslation";
import {
  Drawer,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { useRouter } from "next/router";
import styles from "./LeftMenu.module.scss";
import Link from "next/link";
import { logout } from "utils/userDetails";
import { useGetUser } from "hooks/useGetUser";
import formatPhoneNumber from "utils/formatPhoneNumber";
import { AccordianArrow } from "../Icons";
import { changeContent } from "utils/changeContent";
import {
  CloseIcon,
  RastaLogo,
  LogoutIcon,
  BacpackIcon,
  PhoneIcon,
} from "../Icons";
import LogoutConfirmModal from "../LogoutConfirmModal/LogoutConfirmModal";
import { makeStyles } from "@mui/styles";
import { useStylesAccordian } from "./styles";

const useStyles = makeStyles(() => ({
  paper: {
    borderRadius: 0,
  },
}));

export default function LeftMenu({ isOpen, setIsOpen }) {
  const { t } = useTranslation("common");
  const [openModal, setOpenModal] = useState(false);
  const classes = useStyles();
  const clsAccordian = useStylesAccordian();
  const user = useGetUser();
  const router = useRouter();
  const [expanded, setExpanded] = useState("");

  useEffect(() => {
    const handleRouteChange = () => {
      setIsOpen(false);
      setExpanded(false);
    };
    router.events.on("routeChangeStart", handleRouteChange);
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, []);

  const handleChange = (panel) => (_, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const toggleDrawer = () => (event) => {
    if (
      event?.type === "keydown" &&
      (event?.key === "Tab" || event?.key === "Shift")
    ) {
      return;
    }
    setIsOpen(false);
    setExpanded(false);
  };

  return (
    <>
      <Drawer
        classes={classes}
        anchor="left"
        open={isOpen}
        onClose={toggleDrawer()}
      >
        <div className={styles.root}>
          <div className={styles.leftHead}>
            <div className={styles.closeIcon} onClick={toggleDrawer()}>
              <CloseIcon />
            </div>
            <div className={styles.logo}>
              <Link href="/">
                <a onClick={toggleDrawer()}>
                  <RastaLogo />
                </a>
              </Link>
            </div>
          </div>
          <div className={styles.leftBody}>
            <span>
              <a
                onClick={() => {
                  if (user) {
                    router.push("/user/orders");
                    toggleDrawer();
                  } else {
                    router.push("/login");
                    toggleDrawer();
                  }
                }}
              >
                <div className={styles.item}>
                  <div className={styles.icon}>
                    <BacpackIcon />
                  </div>
                  {t("my_orders")}
                </div>
              </a>
            </span>

            {user && (
              <span>
                <a
                  onClick={() => {
                    toggleDrawer()();
                    setTimeout(() => {
                      setOpenModal(true);
                    }, 200);
                  }}
                >
                  <div className={styles.item}>
                    <div className={styles.icon}>
                      <LogoutIcon />
                    </div>
                    {t("go_out")}
                  </div>
                </a>
              </span>
            )}

            <div className={clsAccordian.root}>
              <Accordion
                square
                expanded={expanded === "panel3"}
                onChange={handleChange("panel3")}
                className={styles.accordian}
              >
                <AccordionSummary
                  expandIcon={<AccordianArrow />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <div className={styles.langTitle}>
                    <img
                      className={styles.image}
                      src={changeContent(
                        router.locale,
                        "/icons/english.png",
                        "/icons/russian.png",
                        "/icons/uzbek.png"
                      )}
                      alt={router.locale}
                    />
                    {changeContent(
                      router.locale,
                      t("english"),
                      t("russian"),
                      t("uzbek")
                    )}
                  </div>
                </AccordionSummary>
                <AccordionDetails>
                  <Link scroll={false} href={router.asPath} locale={"en"}>
                    <a>
                      <div className={styles.langTitle}>
                        <img
                          className={styles.img}
                          src="/icons/english.png"
                          alt="english"
                        />
                        {t("english")}
                      </div>
                    </a>
                  </Link>
                </AccordionDetails>
                <AccordionDetails>
                  <Link scroll={false} href={router.asPath} locale={"ru"}>
                    <a>
                      <div className={styles.langTitle}>
                        <img
                          className={styles.img}
                          src="/icons/russian.png"
                          alt="russian"
                        />
                        {t("russian")}
                      </div>
                    </a>
                  </Link>
                </AccordionDetails>
                <AccordionDetails>
                  <Link scroll={false} href={router.asPath} locale={"uz"}>
                    <a>
                      <div className={styles.langTitle}>
                        <img
                          className={styles.img}
                          src="/icons/uzbek.png"
                          alt="uzbek"
                        />
                        {t("uzbek")}
                      </div>
                    </a>
                  </Link>
                </AccordionDetails>
              </Accordion>
            </div>
          </div>
          <div className={styles.leftFooter}>
            <PhoneIcon />
            <a href={`tel:+998781130123`}>
              <p>{formatPhoneNumber("+998781130123")}</p>
            </a>
          </div>
        </div>
      </Drawer>
      <LogoutConfirmModal
        open={openModal}
        setOpen={setOpenModal}
        logout={logout}
      />
    </>
  );
}
