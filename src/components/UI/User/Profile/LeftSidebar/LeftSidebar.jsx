import { Container } from "@mui/material";
import Link from "next/link";
import useTranslation from "next-translate/useTranslation";
import cls from "./LeftSidebar.module.scss";
import {
  HeartIcon,
  LocationIcon,
  ProfileCardIcon,
  ProfileIcon,
} from "components/UI/Icons";
import { useRouter } from "next/router";

export default function LeftSidebar() {
  const router = useRouter();
  const { t } = useTranslation("common");

  return (
    <div className={cls.sidebar}>
      <div className={cls.list}>
        <Link href="/user">
          <a>
            <div
              className={`${cls.item} ${
                router.pathname === "/user" ? cls.active : ""
              }`}
            >
              <ProfileIcon /> {t("profile")}
            </div>
          </a>
        </Link>
        <Link href="/user/cards">
          <a>
            <div
              className={`${cls.item} ${
                router.pathname === "/user/cards" ? cls.active : ""
              }`}
            >
              <ProfileCardIcon /> {t("my_cards")}
            </div>
          </a>
        </Link>
        <Link href="/user/favourite">
          <a>
            <div
              className={`${cls.item} ${
                router.pathname === "/user/favourite" ? cls.active : ""
              }`}
            >
              <HeartIcon />
              {t("favorites")}
            </div>
          </a>
        </Link>
        <Link href="/user/address">
          <a>
            <div
              className={`${cls.item} ${
                router.pathname === "/user/address" ? cls.active : ""
              }`}
            >
              <LocationIcon /> {t("my_address")}
            </div>
          </a>
        </Link>
      </div>
    </div>
  );
}
