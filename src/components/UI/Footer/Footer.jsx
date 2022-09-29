import styles from "./Footer.module.scss";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useSelector } from "react-redux";
import { Container, Grid } from "@mui/material";
import CallIcon from "@mui/icons-material/Call";
import { FacebookIcon, InstagramIcon, TelegramIcon } from "../Icons";
import MobileFooter from "./MobileFooter";

export function Footer() {
  const { isSearch } = useSelector((state) => state.cart);
  const { t, lang } = useTranslation("common");

  return (
    <>
      <footer className={styles.footer}>
        <Container>
          <div className={styles.box}>
            <Grid container spacing={2}>
              <Grid item xs={3}>
                <ul className={styles.list}>
                  <li>{t("company")}</li>
                  <li>{t("news")}</li>
                  <li>{t("terms_use")}</li>
                  <li>{t("how_to_order")}</li>
                  <li>{t("questions_anwers")}</li>
                </ul>
              </Grid>
              <Grid item xs={3}>
                <ul className={styles.list}>
                  <li>{t("help_for_buyers")}</li>
                  <li>{t("brands")}</li>
                  <li>{t("payment")}</li>
                  <li>{t("delivery")}</li>
                  <li>{t("feedback")}</li>
                  <li>{t("contacts")}</li>
                </ul>
              </Grid>
              <Grid item xs={2}>
                <ul className={styles.list}>
                  <li>{t("services")}</li>
                  <li>{t("brands")}</li>
                  <li>{t("payment")}</li>
                  <li>{t("delivery")}</li>
                  <li>{t("feedback")}</li>
                  <li>{t("contacts")}</li>
                </ul>
              </Grid>
              <Grid item xs={4}>
                <div className={styles.downloadApp}>
                  <p>{t("download_app")}</p>
                  <div className={styles.apps}>
                    <a
                      href="https://apps.apple.com/uz/app/rasta-girgitton/id1447948807"
                      target="_blank"
                    >
                      <img src="/icons/appStore.png" alt="App Store" />
                    </a>
                    <a
                      href="https://play.google.com/store/apps/details?id=com.girgitton.user"
                      target="_blank"
                    >
                      <img src="/icons/googlePlay.png" alt="Google Play" />
                    </a>
                  </div>
                </div>
              </Grid>
            </Grid>
          </div>
          <div className={styles.border} />
          <div className={styles.socialBox}>
            <div className={styles.socialItem}>
              <p>{t("single_call_center")}</p>
              <a href="tel:+998781130123">
                <CallIcon />
                +998 78 113 01 23
              </a>
            </div>
            <div className={styles.socialItem}>
              <p>{t("rasta_in_social")}</p>
              <div className={styles.socials}>
                <a href="https://www.instagram.com/rasta.app/" target="_blank">
                  <InstagramIcon />
                </a>
                <a href="https://t.me/rastaapp" target="_blank">
                  <TelegramIcon />
                </a>
                <a href="https://www.facebook.com/girgitton/" target="_blank">
                  {" "}
                  <FacebookIcon />
                </a>
              </div>
            </div>
          </div>
          <div className={styles.border} />
          <div className={styles.bottomNav}>
            <p>{t("all_rights_reserved")}</p>
            <ul className={styles.privacyLinks}>
              <li>{t("privacy_policy")}</li>
              <li>{t("terms_use")}</li>
            </ul>
          </div>
        </Container>
      </footer>
      <footer
        className={`${styles.mobileFooter} ${isSearch && styles.isSearch}`}
      >
        <MobileFooter />
      </footer>
    </>
  );
}
