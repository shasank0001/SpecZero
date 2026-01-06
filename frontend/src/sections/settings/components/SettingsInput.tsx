/**
 * SettingsInput Component
 * 
 * An input field for text settings.
 * This is a props-based component for export.
 */

export interface SettingsInputProps {
  label: string;
  description?: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "password" | "url" | "number";
  placeholder?: string;
  disabled?: boolean;
}

export function SettingsInput({ 
  label, 
  description, 
  value, 
  onChange, 
  type = "text",
  placeholder,
  disabled 
}: SettingsInputProps) {
  return (
    <div className="py-3">
      <label className="block">
        <p className="font-medium text-foreground text-sm">{label}</p>
        {description && (
          <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`mt-2 w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
        />
      </label>
    </div>
  );
}
