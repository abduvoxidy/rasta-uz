import { useMemo } from "react";
import useTranslation from "next-translate/useTranslation";
import cls from "./Input.module.scss";
import CircularProgress from "@mui/material/CircularProgress";
import { ClearIcon } from "components/UI/Icons";

export default function Input({
  placeholder,
  startAdornment,
  endAdornment,
  className = "",
  endAdorment,
  register,
  name = "name",
  isLoading = false,
  isClear = false,
  clearFn,
  disabled = false,
  isError,
  required,
  errors,
  ...restProps
}) {
  const { t } = useTranslation("common");
  const registerProps = useMemo(
    () => (register ? { ...register(name, { required }) } : {}),
    [name]
  );

  return (
    <div className={`${cls.inputBox} ${className}`}>
      {startAdornment && (
        <div className={cls.startAdornment}>{startAdornment}</div>
      )}
      <input
        placeholder={placeholder}
        {...restProps}
        {...registerProps}
        disabled={disabled}
        className={`${cls.input} ${
          startAdornment ? cls.withStartAdornment : ""
        } ${endAdorment ? cls.withEndAdornment : ""}
          ${isError || (errors && errors[name]) ? cls.error : ""} ${
          disabled ? cls.disabled : ""
        }`}
      />
      {endAdorment && <div className={cls.endAdorment}>{endAdorment}</div>}
      {isLoading && (
        <div className={cls.loader}>
          <CircularProgress size={18} />
        </div>
      )}
      {isClear && !isLoading && (
        <div className={cls.clear} onClick={clearFn}>
          <ClearIcon />
        </div>
      )}
      {errors && errors[name] && <span>{errors && errors[name]?.message}</span>}
      {errors && errors[name] && errors[name]?.type === "required" && (
        <span>{t("required_field")}</span>
      )}
    </div>
  );
}
