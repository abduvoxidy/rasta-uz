import { makeStyles } from "@mui/styles";
import { rem } from "utils/pxToRem";

export const useStyles = makeStyles({
  root: {
    "@media (max-width: 768px)": {
      "& .MuiDialog-paper": {
        margin: rem(16),
        width: "100%",
      },
    },
  },
});

export const useStylesAddress = makeStyles({
  root: {
    "@media (max-width: 768px)": {
      "& .MuiDialog-container": {
        alignItems: "flex-start",
      },
      "& .MuiDialog-paper": {
        margin: rem(0),
        width: "100%",
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
      },
    },
  },
});
