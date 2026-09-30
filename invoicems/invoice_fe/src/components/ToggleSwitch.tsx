"use client";

export default function ToggleSwitch({
  checked,
  onChange,
  labelChecked,
  labelUnchecked,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  labelChecked: string;
  labelUnchecked: string;
}) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />

      <div className="
        w-14 h-7 
        bg-gray-300 
        peer-checked:bg-green-500 
        rounded-full 
        peer-checked:after:translate-x-7 
        after:content-[''] 
        after:absolute 
        after:top-0.5 
        after:left-0.5 
        after:bg-white 
        after:border-gray-300 
        after:border 
        after:rounded-full 
        after:h-6 
        after:w-6 
        after:transition-all
      "></div>

      <span className="ml-3 text-sm text-gray-700">
        {checked ? labelChecked : labelUnchecked}
      </span>
    </label>
  );
}