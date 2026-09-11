import { useState } from "react";

type PasswordInputProps = {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
};

function PasswordInput({
  label,
  placeholder,
  value,
  onChange,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  function getPasswordStrength(password: string) {
    if (password.length < 6) {
      return {
        label: "Weak",
        color: "text-red-600",
      };
    }

    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);

    if (hasUppercase && hasNumber && password.length >= 8) {
      return {
        label: "Strong",
        color: "text-green-600",
      };
    }

    return {
      label: "Medium",
      color: "text-yellow-600",
    };
  }

  const strength = getPasswordStrength(value);

  return (
    <div className="mb-5">
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-16 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-blue-900 hover:text-blue-700"
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>

      {value && (
        <p className={`mt-2 text-sm font-medium ${strength.color}`}>
          Password Strength: {strength.label}
        </p>
      )}
    </div>
  );
}

export default PasswordInput;