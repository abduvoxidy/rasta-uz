import { TextField } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";

const useStyles = makeStyles(() => ({
  container: {
    "& .MuiDialogActions-root": {
      display: "none",
    },

    "& .PrivatePickersSlideTransition-root": {
      "& .MuiButtonBase-root.Mui-selected": {
        backgroundColor: "var(--primary-color)",
      },
    },
    "& .MuiPickersToolbar-root": {
      "& .MuiButtonBase-root": {
        display: "none",
      },
    },
  },
}));

export default function DatePicker({
  selectedDate,
  handleChange,
  open,
  setOpen = () => {},
}) {
  const classes = useStyles();
  return (
    <div className="mui-datepicker-mobile">
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <MobileDatePicker
          closeOnSelect
          inputFormat="MM.dd.yyyy"
          value={selectedDate}
          onChange={handleChange}
          disableFuture
          open={open}
          onClose={() => setOpen(false)}
          renderInput={(params) => (
            <TextField
              onClick={() => setOpen(true)}
              {...params}
              placeholder="Выберите дату рождения"
            />
          )}
          DialogProps={{
            classes: {
              paper: classes.container,
            },
          }}
        />
      </LocalizationProvider>
    </div>
  );
}
