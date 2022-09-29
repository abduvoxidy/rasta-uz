import { Skeleton } from "@mui/material";
import { rem } from "utils/pxToRem";
import cls from "./ListLoading.module.scss";

export default function ListLoading({ className = "" }) {
  return Array(9)
    .fill("")
    .map((_, index) => (
      <div key={index} className={`${cls.item} ${className}`}>
        <div className={cls.card}>
          <div className={cls.img}>
            <Skeleton
              height="100%"
              key={index + "skleton"}
              width="100%"
              style={{ transform: "scale(1)" }}
            />
          </div>
          <div className={cls.body}>
            <p>
              <Skeleton width="60%" style={{ borderRadius: rem(8) }} />
            </p>
            <div className={cls.options}>
              <div className={cls.option}>
                <Skeleton height={40} style={{ borderRadius: rem(12) }} />
              </div>
              <div className={cls.option}>
                <Skeleton height={40} style={{ borderRadius: rem(12) }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    ));
}
