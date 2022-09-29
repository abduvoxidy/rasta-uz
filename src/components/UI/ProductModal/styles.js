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
        maxHeight: `calc(100vh - ${rem(54)} )`,
        width: "100%",
      },
    },
  },
});
