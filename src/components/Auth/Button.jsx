function Button({
  children,
  type = "button",
  onClick,
  disabled = false,
  variant = "primary",
}) {
  const className =
    variant === "primary"
      ? "rounded-full bg-gradient-to-br from-violet-600 to-blue-600 px-6 py-3.5 text-base font-semibold text-white shadow-[0_0_30px_rgba(124,58,237,.35)] transition hover:-translate-y-0.5 hover:shadow-[0_0_50px_rgba(124,58,237,.55)] disabled:cursor-not-allowed disabled:opacity-70"
      : "rounded-full border border-violet-500/35 px-6 py-3 text-sm font-semibold text-[#F0EEFF] transition hover:border-violet-400/60 hover:bg-violet-500/10 disabled:cursor-not-allowed disabled:opacity-70";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      {children}
    </button>
  );
}

export default Button;
