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
