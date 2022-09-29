import styles from "./Footer.module.scss";
import useTranslation from "next-translate/useTranslation";
import {
  Container,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { AccordianArrow } from "../Icons";
import {
  FacebookIcon,
  InstagramIcon,
  TelegramIcon,
  YouTubeIcon,
  OdnoClassIcon,
  RastaLogo,
} from "../Icons";
import { useStyles } from "./styles";
import Link from "next/link";

export default function MobileFooter() {
  const classes = useStyles();
  const { t } = useTranslation("common");

  return (
    <>
      <Container className={styles.container}>
        <div className={styles.boxM}>
          <>
            <div className={styles.logo}>
              <Link href="/">
                <a>
                  <RastaLogo />
                </a>
              </Link>
            </div>
            <div className={classes.root}>
              <Accordion>
                <AccordionSummary
                  expandIcon={<AccordianArrow />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <p className="title">{t("company")}</p>
                </AccordionSummary>
                <AccordionDetails>
                  <ul className={styles.list}>
                    <li>{t("news")}</li>
                    <li>{t("terms_use")}</li>
                    <li>{t("how_to_order")}</li>
                    <li>{t("questions_anwers")}</li>
                  </ul>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary
                  expandIcon={<AccordianArrow />}
                  aria-controls="panel2a-content"
                  id="panel2a-header"
                >
                  <p className="title">{t("help_for_buyers")}</p>
                </AccordionSummary>
                <AccordionDetails>
                  <ul className={styles.list}>
                    <li>{t("brands")}</li>
                    <li>{t("payment")}</li>
                    <li>{t("delivery")}</li>
                    <li>{t("feedback")}</li>
                    <li>{t("contacts")}</li>
                  </ul>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary
                  expandIcon={<AccordianArrow />}
                  aria-controls="panel2a-content"
                  id="panel2a-header"
                >
                  <p className="title">{t("services")}</p>
                </AccordionSummary>
                <AccordionDetails>
                  <ul className={styles.list}>
                    <li>{t("brands")}</li>
                    <li>{t("payment")}</li>
                    <li>{t("delivery")}</li>
                    <li>{t("feedback")}</li>
                    <li>{t("contacts")}</li>
                  </ul>
                </AccordionDetails>
              </Accordion>
            </div>
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
            <span className={styles.line}></span>
          </>
          <div className={styles.socialBox}>
            <p>{t("rasta_in_social")}</p>
            <div className={styles.socials}>
              <a href="https://www.instagram.com/rasta.app/" target="_blank">
                <InstagramIcon />
              </a>
              <a href="https://www.facebook.com/girgitton/" target="_blank">
                {" "}
                <FacebookIcon />
              </a>

              {/* <YouTubeIcon /> */}
              <a href="https://t.me/rastaapp" target="_blank">
                <TelegramIcon />
              </a>
              {/* <OdnoClassIcon /> */}
            </div>
          </div>
          <p className={styles.privacy}>{t("all_rights_reserved")}</p>
        </div>
      </Container>
    </>
  );
}
