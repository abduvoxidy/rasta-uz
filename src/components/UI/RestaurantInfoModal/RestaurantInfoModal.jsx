import React, { forwardRef } from "react";
import useTranslation from "next-translate/useTranslation";
import { Dialog, Slide } from "@mui/material";
import { useStyles } from "./styles";
import cls from "./RestaurantInfoModal.module.scss";
import { CloseIcon } from "../Icons";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function RestaurantInfoModal({
  openInfo,
  setOpenInfo,
  shipper,
  branch,
}) {
  const { t } = useTranslation("common");
  const classes = useStyles();
  const weekDays = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  return (
    <>
      <Dialog
        className={classes.root}
        open={openInfo}
        TransitionComponent={Transition}
        onClose={() => setOpenInfo(false)}
      >
        <div className={cls.root}>
          <div className={cls.header}>
            <h3>{shipper?.name}</h3>
            <div className={cls.close} onClick={() => setOpenInfo(false)}>
              <CloseIcon />
            </div>
          </div>
          <div className={cls.body}>
            <div className={cls.address}>
              <h3>{t("address")}</h3>
              <p>{branch && branch[0]?.address}</p>
            </div>
            <div className={cls.workTime}>
              <h3>{t("working_hours")}</h3>
              <div className={cls.weekDays}>
                {branch &&
                  branch.length > 0 &&
                  weekDays.map((item, index) => (
                    <div className={cls.item} key={item}>
                      <p className={cls.day}>{t(item)}</p>{" "}
                      <p className={cls.time}>
                        {branch[0].daily_start_times[index]} -{" "}
                        {branch[0].daily_end_times[index]}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}
