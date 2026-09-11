type CheckboxProps = {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: string;
  };
  
  function Checkbox({
    checked,
    onChange,
    label,
  }: CheckboxProps) {
    return (
      <label className="mb-6 flex cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="h-5 w-5 rounded border-gray-300 accent-emerald-600"
        />
  
        <span className="text-sm text-slate-700">
          {label}
        </span>
      </label>
    );
  }
  
  export default Checkbox;