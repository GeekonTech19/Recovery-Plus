type TextAreaProps = {
    label: string;
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    rows?: number;
  };
  
  function TextArea({
    label,
    placeholder,
    value,
    onChange,
    rows = 5,
  }: TextAreaProps) {
    return (
      <div className="mb-5">
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          {label}
        </label>
  
        <textarea
          rows={rows}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 resize-none"
        />
      </div>
    );
  }
  
  export default TextArea;