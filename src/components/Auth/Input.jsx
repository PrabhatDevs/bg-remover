function Input({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  name,
  ...rest
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm text-[#CFCBE7]">
      <span>{label}</span>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...rest}
        className="w-full rounded-xl border border-violet-500/30 bg-white/5 px-4 py-[13px] text-[15px] text-[#F0EEFF] outline-none transition placeholder:text-[#8B85A8] focus:border-violet-500/80 focus:bg-violet-500/10"
      />
    </label>
  );
}

export default Input;
