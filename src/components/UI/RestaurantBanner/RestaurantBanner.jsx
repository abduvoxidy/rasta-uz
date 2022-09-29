import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useTranslation from "next-translate/useTranslation";
import {
  StarRestaurantIcon,
  TimerRestaurantIcon,
  MobileSearchIcon,
  ArrowBackIcon,
  YellowStarIcon,
  TimerIcon,
  InfoIcon,
} from "../Icons";
import InfoIconMaterial from "@mui/icons-material/Info";
import cls from "./RestaurantBanner.module.scss";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useFavourite } from "services";
import { useDispatch } from "react-redux";
import { setIsSearch } from "store/cart/cartSlice";
import { Popover } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { rem } from "utils/pxToRem";

const useStyles = makeStyles(() => ({
  paper: {
    boxShadow: "0px 1px 12px rgba(0, 0, 0, 0.08)",
    width: rem(300),
  },
}));

export default function RestaurantBanner({
  shipper,
  user,
  branch,
  handleOpenInfo,
}) {
  const [imageError, setImageError] = useState(false);
  const classes = useStyles();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const { t, lang } = useTranslation("common");

  const { favourite, createMutation, deleteMutation } = useFavourite({
    favouriteOneParams: {
      user_id: user?.id,
      shipper_id: shipper?.id,
    },
    createMutationProps: {
      onSuccess: () => {
        favourite.refetch();
      },
    },
    deleteMutationProps: {
      onSuccess: () => {
        favourite.refetch();
      },
    },
  });

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <div className={cls.banner}>
        <Image
          src={
            imageError
              ? process.env.NEXT_PUBLIC_DEFAULT_IMAGE_RESTAURANT
              : shipper.menu_image
          }
          layout="fill"
          objectFit="cover"
          onLoadingComplete={(result) => {
            if (result.naturalWidth === 0) setImageError(true);
          }}
          onErrorCapture={() => setImageError(true)}
          onError={() => setImageError(true)}
          onEmptied={() => setImageError(true)}
        />
        <Link href="/">
          <a>
            <div className={cls.arrowBack}>
              <ArrowBackIcon />
            </div>
          </a>
        </Link>
        <div className={cls.wrapperIcons}>
          <div className={cls.favourite}>
            {favourite.data && favourite.data.id ? (
              <FavoriteIcon
                style={{ color: "#f2271c" }}
                onClick={() => {
                  deleteMutation.mutate(favourite.data.id);
                }}
              />
            ) : (
              <FavoriteBorderIcon
                onClick={() =>
                  createMutation.mutate({
                    user_id: user?.id,
                    shipper_id: shipper?.id,
                  })
                }
              />
            )}
          </div>
          <div
            className={cls.search}
            onClick={() => dispatch(setIsSearch(true))}
          >
            <MobileSearchIcon />
          </div>
        </div>

        <div className={cls.options}>
          <h1>{shipper?.name}</h1>
          <p>
            {/* Фаст-фуд&nbsp;&nbsp;
          <DotRestaurantIcon />
          &nbsp;&nbsp; */}
            <StarRestaurantIcon />
            &nbsp;&nbsp;{t("rating")} {shipper?.rate}%
          </p>

          <p className={cls.info} onClick={handleClick}>
            <InfoIconMaterial />
            &nbsp;&nbsp;{t("restaurant_information")}
          </p>

          <span>
            <TimerRestaurantIcon />
            &nbsp;{t("today_open")}:{" "}
            {branch && branch[0]?.daily_start_times[new Date().getDay() - 1]} -{" "}
            {branch && branch[0]?.daily_end_times[new Date().getDay() - 1]}
          </span>
        </div>
        {/* Responsive */}
        <div className={cls.mobileOptions}>
          <h1>{shipper?.name}</h1>
          <div className={cls.items}>
            <div className={cls.item}>
              <YellowStarIcon />
              <p>{shipper?.rate}%</p>
            </div>
            <div className={cls.item}>
              <TimerIcon />
              <p>
                {branch &&
                  branch[0]?.daily_start_times[new Date().getDay() - 1]}{" "}
                -{" "}
                {branch && branch[0]?.daily_end_times[new Date().getDay() - 1]}
              </p>
            </div>
            <div className={cls.item} onClick={() => handleOpenInfo()}>
              <InfoIcon />
            </div>
          </div>
        </div>
      </div>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        classes={classes}
      >
        <div className={cls.popoverInfo}>
          <p>{shipper?.name}</p>
          <p>{branch && branch[0]?.address}</p>
          <p>
            {t("delivery_to")}:{" "}
            {branch && branch[0]?.daily_end_times[new Date().getDay() - 1]}
          </p>
        </div>
      </Popover>
    </>
  );
}
