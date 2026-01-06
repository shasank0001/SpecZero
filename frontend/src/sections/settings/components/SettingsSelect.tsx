/**
 * SettingsSelect Component
 * 
 * A dropdown select for settings with predefined options.
 * This is a props-based component for export.
 */

export interface SettingsOption {
  value: string;
  label: string;
}

export interface SettingsSelectProps {
  label: string;
  description?: string;
  value: string;
  onChange: (value: string) => void;
  options: SettingsOption[];
  disabled?: boolean;
}

export function SettingsSelect({ 
  label, 
  description, 
  value, 
  onChange, 
  options,
  disabled 
}: SettingsSelectProps) {
  return (
    <div className="py-3">
      <label className="block">
        <p className="font-medium text-foreground text-sm">{label}</p>
        {description && (
          <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
        )}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`mt-2 w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
