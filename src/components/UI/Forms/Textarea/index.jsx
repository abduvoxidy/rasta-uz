import cls from "./Textarea.module.scss";

export default function Textarea({
  placeholder,
  startAdornment,
  endAdornment,
  className = "",
  ...restProps
}) {
  return (
    <div className={`${cls.textareaBox} ${className}`}>
      <textarea
        placeholder={placeholder}
        className={cls.textarea}
        rows="4"
        {...restProps}
      />
    </div>
  );
}
