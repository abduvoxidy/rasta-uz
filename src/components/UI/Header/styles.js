import { makeStyles } from "@mui/styles";
import { rem } from "utils/pxToRem";

export const useStyles = makeStyles(() => ({
  paper: {
    boxShadow: "0px 1px 12px rgba(0, 0, 0, 0.08)",
    top: `${rem(78)}!important`,
    width: rem(253),
    "@media (max-width: 768px)": {
      top: `${rem(68)}!important`,
    },
  },
}));
