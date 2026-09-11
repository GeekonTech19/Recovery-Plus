type TriggerSliderProps = {
    value: number;
    onChange: (value: number) => void;
  };
  
  function TriggerSlider({
    value,
    onChange,
  }: TriggerSliderProps) {
    return (
      <div className="mb-6">
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Trigger Level
        </label>
  
        <input
          type="range"
          min={1}
          max={10}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full"
        />
  
        <p className="mt-2 text-center font-semibold text-blue-900">
          {value} / 10
        </p>
      </div>
    );
  }
  
  export default TriggerSlider;