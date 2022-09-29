import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Popover } from "@mui/material";
import useTranslation from "next-translate/useTranslation";
import { useState } from "react";
import cls from "./RestaurantCategory.module.scss";
import { makeStyles } from "@mui/styles";
import { rem } from "utils/pxToRem";

const useStyles = makeStyles(() => ({
  paper: {
    boxShadow: "0px 1px 12px rgba(0, 0, 0, 0.08)",
    width: rem(253),
    overflow: "hidden",
  },
}));

export default function RestaurantCategory({
  className = "",
  value,
  categories,
  scrollToCategory,
  elementId,
}) {
  const { t, lang } = useTranslation("common");
  const [anchorEl, setAnchorEl] = useState(null);
  const classes = useStyles();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  return (
    <>
      <div id={elementId} className={`${cls.tabs} ${className}`}>
        <div className={cls.categorieTabs}>
          <div className={cls.categories}>
            {categories?.slice(0, 5)?.map((item, index) => (
              <button
                key={item.id}
                onClick={() => scrollToCategory(index)}
                className={`${cls.tabItem} ${
                  value && value.id === item.id ? cls.active : ""
                }`}
              >
                {item?.name[lang]}
              </button>
            ))}
            {categories?.length > 5 && (
              <button className={cls.tabItem} onClick={handleClick}>
                {t("more")} <KeyboardArrowDownIcon />
              </button>
            )}
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
        transformOrigin={{ horizontal: "center", vertical: -6 }}
        classes={classes}
      >
        <div className={`${cls.menus} scrollBar`}>
          {categories?.slice(5)?.map((item, index) => (
            <button
              key={item.id}
              onClick={() => {
                setTimeout(() => {
                  scrollToCategory(index + 5);
                }, 500);

                handleClose();
              }}
              className={cls.menu}
            >
              {item?.name && item?.name[lang]}
            </button>
          ))}
        </div>
      </Popover>
    </>
  );
}
