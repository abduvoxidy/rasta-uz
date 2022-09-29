import { makeStyles } from "@mui/styles";
import { rem } from "utils/pxToRem";

export const useStyles = makeStyles({
  root: {
    "& .MuiAccordion-root": {
      color: "#000",
      boxShadow: "none",
      margin: 0,
      "&:before": {
        backgroundColor: "transparent",
      },
    },
    "& .MuiAccordionSummary-root": {
      padding: "0",
      minHeight: "auto",
      marginBottom: rem(12),
      "& .MuiAccordionSummary-content": {
        margin: "0",
      },
      "& .title": {
        fontWeight: "600",
        fontSize: rem(14),
        lineHeight: rem(24),
      },
    },
    "& .MuiAccordionDetails-root": {
      padding: 0,
      paddingBottom: rem(12),
    },
  },
});
