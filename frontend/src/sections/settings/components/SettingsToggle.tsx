/**
 * SettingsToggle Component
 * 
 * A toggle switch for boolean settings.
 * This is a props-based component for export.
 */

export interface SettingsToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function SettingsToggle({ label, description, checked, onChange, disabled }: SettingsToggleProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1 pr-4">
        <p className="font-medium text-foreground text-sm">{label}</p>
        {description && (
          <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      <button
        onClick={() => onChange(!checked)}
        disabled={disabled}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
          checked ? "bg-primary" : "bg-muted"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <div
          className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
