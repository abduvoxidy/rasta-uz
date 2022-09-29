import { useEffect, useState } from "react";
import cls from "./CategoryTabs.module.scss";
import { useSelector } from "react-redux";
import useTranslation from "next-translate/useTranslation";
import { Dialog, Popover } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import { useCompanyCategory } from "services";
import { useStyles, useStylesPopover } from "./styles";
// components
import GreenButton from "../Buttons/GreenButton";
import GreyButton from "../Buttons/GreyButton";
import { FilterIcon, CloseIcon } from "../Icons";

export default function CategoryTabs({
  className = "",
  title,
  withFilter = false,
  onChange,
  values,
}) {
  const { t, lang } = useTranslation("common");

  const classesPopover = useStylesPopover();
  const regionId = useSelector((state) => state.common.regionId);
  const { companyCategories } = useCompanyCategory({
    regionId: regionId,
  });
  const [filters, setFilters] = useState({
    categories: [],
    time: "",
  });
  const times = [ 35, 45, 60, 120];
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const classes = useStyles();
  const openPopover = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleClickOpen = () => {
    setOpen(true);
  };

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      categories: values,
    }));
  }, [values]);

  const handleClose = (isClear) => {
    !isClear && setOpen(false);
    if (filters.categories.length > 0 && values.length === 0) {
      setFilters({
        categories: [],
        time: "",
      });
    }
    if (filters.categories.length > 0 && values.length > 0) {
      setFilters({
        categories: [],
        time: "",
      });
    }
    if (
      filters.categories.map((item) => item.id).join(",") ===
      values.map((item) => item.id).join(",")
    ) {
      setFilters({
        categories: [],
        time: "",
      });
      onChange([], 120);
    }
  };

  const handleChangeFilter = (value) => {
    const categoryId = filters.categories.find((item) => item.id === value.id);
    if (categoryId) {
      setFilters((prev) => ({
        ...prev,
        categories: prev.categories.filter((item) => item.id !== value.id),
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        categories: [...prev.categories, value],
      }));
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <div className={`${cls.tabs} ${className}`}>
        {title && <h1 className={cls.title}>{t("restaurants")}</h1>}
        <div className={cls.categorieTabs}>
          {withFilter && (
            <button className={cls.filterBtnMob} onClick={handleClickOpen}>
              {filters.categories.length > 0 || filters.time ? (
                <span className={cls.filterCircle} />
              ) : (
                ""
              )}
              <FilterIcon />
            </button>
          )}
          <div className={cls.categories}>
            {companyCategories?.data?.company_categories
              ?.slice(0, 6)
              .map((item) => (
                <button
                  key={item.id}
                  onClick={() => onChange(item)}
                  className={`${cls.tabItem} ${
                    values.map((val) => val.id).includes(item.id)
                      ? cls.active
                      : ""
                  }`}
                >
                  {item.name[lang]}
                </button>
              ))}
            {companyCategories?.data?.company_categories?.length > 6 && (
              <button className={cls.tabItem} onClick={handleClick}>
                {t("more")} <KeyboardArrowDownIcon />
              </button>
            )}
          </div>
          {withFilter && (
            <button className={cls.filterBtn} onClick={handleClickOpen}>
              {t("filter")}
              {filters.categories.length > 0 || filters.time ? (
                <span className={cls.filterCircle} />
              ) : (
                ""
              )}
              <FilterIcon />
            </button>
          )}
        </div>
      </div>
      <Dialog
        className={classes.root}
        open={open}
        onClose={() => setOpen(false)}
      >
        <div className={cls.filterDialog}>
          <div className={cls.close} onClick={() => setOpen(false)}>
            <CloseIcon />
          </div>
          <p className={cls.filterTitle}>{t("filter")}</p>
          <p className={cls.subTitle}>{t("select_category")} </p>
          <div className={cls.items}>
            {companyCategories?.data?.company_categories?.map((item) => (
              <div key={item.id + "filter"} className={cls.filterItem}>
                <button
                  onClick={() => handleChangeFilter(item)}
                  className={`${cls.item} ${
                    filters.categories.map((val) => val.id).includes(item.id)
                      ? cls.active
                      : ""
                  }`}
                >
                  {item.name[lang]}
                </button>
              </div>
            ))}
          </div>
          <div className={cls.deliveryTimes}>
            <p className={cls.subTitle}>{t("select_delivery_time")}</p>
            <div className={cls.times}>
              {times.map((item) => (
                <button
                  key={item + "time"}
                  onClick={() => {
                    if (filters.time === item) {
                      setFilters((prev) => ({
                        ...prev,
                        time: "",
                      }));
                    } else {
                      setFilters((prev) => ({
                        ...prev,
                        time: item,
                      }));
                    }
                  }}
                  className={`${cls.time} ${
                    filters.time === item ? cls.active : ""
                  }`}
                >
                  {item} {t("minute")}
                </button>
              ))}
            </div>
          </div>
          <div className={cls.buttons}>
            <GreyButton
              fullWidth
              onClick={() => {
                handleClose(true);
              }}
              // disabled={!filters.categories.length > 0 && !filters.time}
            >
              {t("clear_filter")}
            </GreyButton>
            <GreenButton
              fullWidth
              onClick={() => {
                //if (filters.categories.length > 0 || filters.time) {
                onChange(filters.categories, filters.time);
                //}
                setOpen(false);
              }}
            >
              {t("confirm")}
            </GreenButton>
          </div>
        </div>
        <div className={cls.buttonsMobile}>
          <GreyButton
            fullWidth
            onClick={() => {
              handleClose(true);
            }}
            // disabled={!filters.categories.length > 0 && !filters.time}
          >
            {t("clear_filter")}
          </GreyButton>
          <GreenButton
            fullWidth
            onClick={() => {
              if (filters.categories.length > 0 || filters.time) {
                onChange(filters.categories, filters.time);
              }
              setOpen(false);
            }}
          >
            {t("confirm")}
          </GreenButton>
        </div>
      </Dialog>
      <Popover
        id={id}
        open={openPopover}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{ horizontal: "center", vertical: -6 }}
        classes={classesPopover}
      >
        <div className={`${cls.menus} scrollBar`}>
          {companyCategories?.data?.company_categories
            ?.slice(6)
            ?.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  handleClosePopover();
                  onChange(item);
                }}
                className={`${cls.menu} ${
                  values.map((val) => val.id).includes(item.id)
                    ? cls.active
                    : ""
                }`}
              >
                {item?.name[lang]}
              </button>
            ))}
        </div>
      </Popover>
    </>
  );
}
