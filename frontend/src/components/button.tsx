type ButtonProps = {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
};

function Button({
  label,
  onClick,
  disabled = false,
}: ButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`w-full rounded-xl py-4 text-lg font-semibold text-white transition ${
        disabled
          ? "bg-slate-400 cursor-not-allowed"
          : "bg-blue-900 hover:bg-blue-800"
      }`}
    >
      {label}
    </button>
  );
}

export default Button;