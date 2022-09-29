import { Controller } from "react-hook-form";
import useTranslation from "next-translate/useTranslation";
import cls from "./InputMask.module.scss";
import InputMaskCopy from "react-input-mask";

export default function InputMask({
  placeholder,
  startAdornment,
  endAdornment,
  className = "",
  endAdorment,
  name = "name",
  errors = {},
  control = {},
  register = () => {},
  required,
  ...restProps
}) {
  const { t } = useTranslation("common");

  return (
    <div className={`${cls.inputBox} ${className}`}>
      {startAdornment && (
        <div className={cls.startAdornment}>{startAdornment}</div>
      )}
      <Controller
        control={control}
        name={name}
        rules={{ required }}
        render={({ field }) => (
          <InputMaskCopy
            mask="99/99"
            maskChar=""
            value={field.value}
            onChange={field.onChange}
            placeholder={placeholder}
            className={`${cls.input} ${
              startAdornment ? cls.withStartAdornment : ""
            } ${endAdorment ? cls.withEndAdornment : ""} 
              ${errors[name] ? cls.error : ""}
              `}
            {...restProps}
          />
        )}
      />
      {endAdorment && <div className={cls.endAdorment}>{endAdorment}</div>}
      {errors && errors[name] && <span>{errors && errors[name]?.message}</span>}
      {errors && errors[name] && errors[name]?.type === "required" && (
        <span>{t("required_field")}</span>
      )}
    </div>
  );
}
