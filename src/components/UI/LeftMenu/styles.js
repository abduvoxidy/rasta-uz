import { makeStyles } from "@mui/styles";
import { rem } from "utils/pxToRem";

export const useStylesAccordian = makeStyles({
  root: {
    "& .MuiAccordion-root": {
      color: "#000",
      boxShadow: "none",
      "&:before": {
        backgroundColor: "transparent",
      },
    },
    "& .MuiAccordionSummary-root": {
      minHeight: "auto",
      padding: rem(17),
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
      padding: rem(12),
      paddingLeft: rem(16),
    },
  },
});
