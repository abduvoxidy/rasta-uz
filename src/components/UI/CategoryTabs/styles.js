import { makeStyles } from "@mui/styles";
import { rem } from "utils/pxToRem";

export const useStyles = makeStyles({
  root: {
    "@media (max-width: 768px)": {
      "& .MuiDialog-container": {
        alignItems: "flex-end",
      },
      "& .MuiDialog-paper": {
        margin: 0,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        height: "auto",
      },
    },
  },
});

export const useStylesPopover = makeStyles(() => ({
  paper: {
    boxShadow: "0px 1px 12px rgba(0, 0, 0, 0.08)",
    width: rem(253),
    overflow: "hidden",
  },
}));
