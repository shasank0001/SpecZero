/**
 * Settings Preview Wrapper
 * 
 * This file is NOT exported - it's used only for local preview.
 * It imports sample data and passes it to the props-based components.
 */
import { useState } from "react";
import { SettingsSection } from "./components/SettingsSection";
import { SettingsToggle } from "./components/SettingsToggle";
import { SettingsInput } from "./components/SettingsInput";
import { SettingsSelect } from "./components/SettingsSelect";
import { 
  User, Bell, Shield, Palette, Globe, 
  CreditCard, HelpCircle, LogOut, Save
} from "lucide-react";

interface SettingsState {
  // Profile
  name: string;
  email: string;
  phone: string;
  
  // Notifications
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  appointmentReminders: boolean;
  marketingEmails: boolean;
  
  // Appearance
  theme: string;
  language: string;
  timezone: string;
  dateFormat: string;
  
  // Security
  twoFactorAuth: boolean;
  sessionTimeout: string;
  loginAlerts: boolean;
}

export default function SettingsPreview() {
  const [settings, setSettings] = useState<SettingsState>({
    // Profile
    name: "Dr. Jane Wilson",
    email: "jane.wilson@clinic.com",
    phone: "(555) 123-4567",
    
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
    marketingEmails: false,
    
    // Appearance
    theme: "system",
    language: "en",
    timezone: "America/New_York",
    dateFormat: "MM/DD/YYYY",
    
    // Security
    twoFactorAuth: true,
    sessionTimeout: "30",
    loginAlerts: true,
  });

  const updateSetting = <K extends keyof SettingsState>(
    key: K, 
    value: SettingsState[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    console.log("Save settings:", settings);
  };

  return (
    <div className="h-full w-full bg-background overflow-auto">
      <div className="p-4 sm:p-6 space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Settings</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your account preferences and settings
            </p>
          </div>
          <button 
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>

        {/* Profile Section */}
        <SettingsSection
          title="Profile"
          description="Manage your personal information"
          icon={User}
        >
          <SettingsInput
            label="Full Name"
            value={settings.name}
            onChange={(v) => updateSetting("name", v)}
            placeholder="Enter your name"
          />
          <SettingsInput
            label="Email Address"
            type="email"
            value={settings.email}
            onChange={(v) => updateSetting("email", v)}
            placeholder="Enter your email"
          />
          <SettingsInput
            label="Phone Number"
            value={settings.phone}
            onChange={(v) => updateSetting("phone", v)}
            placeholder="Enter your phone number"
          />
          <div className="mt-4 pt-4 border-t border-border">
            <button className="px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors">
              Change Password
            </button>
          </div>
        </SettingsSection>

        {/* Notifications Section */}
        <SettingsSection
          title="Notifications"
          description="Configure how you receive notifications"
          icon={Bell}
        >
          <SettingsToggle
            label="Email Notifications"
            description="Receive notifications via email"
            checked={settings.emailNotifications}
            onChange={(v) => updateSetting("emailNotifications", v)}
          />
          <SettingsToggle
            label="Push Notifications"
            description="Receive push notifications in browser"
            checked={settings.pushNotifications}
            onChange={(v) => updateSetting("pushNotifications", v)}
          />
          <SettingsToggle
            label="SMS Notifications"
            description="Receive text message notifications"
            checked={settings.smsNotifications}
            onChange={(v) => updateSetting("smsNotifications", v)}
          />
          <SettingsToggle
            label="Appointment Reminders"
            description="Get reminded before scheduled appointments"
            checked={settings.appointmentReminders}
            onChange={(v) => updateSetting("appointmentReminders", v)}
          />
          <SettingsToggle
            label="Marketing Emails"
            description="Receive product updates and newsletters"
            checked={settings.marketingEmails}
            onChange={(v) => updateSetting("marketingEmails", v)}
          />
        </SettingsSection>

        {/* Appearance Section */}
        <SettingsSection
          title="Appearance"
          description="Customize the look and feel"
          icon={Palette}
        >
          <SettingsSelect
            label="Theme"
            description="Choose your preferred color theme"
            value={settings.theme}
            onChange={(v) => updateSetting("theme", v)}
            options={[
              { value: "light", label: "Light" },
              { value: "dark", label: "Dark" },
              { value: "system", label: "System" },
            ]}
          />
          <SettingsSelect
            label="Language"
            description="Choose your preferred language"
            value={settings.language}
            onChange={(v) => updateSetting("language", v)}
            options={[
              { value: "en", label: "English" },
              { value: "es", label: "Español" },
              { value: "fr", label: "Français" },
              { value: "de", label: "Deutsch" },
            ]}
          />
          <SettingsSelect
            label="Timezone"
            description="Set your local timezone"
            value={settings.timezone}
            onChange={(v) => updateSetting("timezone", v)}
            options={[
              { value: "America/New_York", label: "Eastern Time (ET)" },
              { value: "America/Chicago", label: "Central Time (CT)" },
              { value: "America/Denver", label: "Mountain Time (MT)" },
              { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
              { value: "Europe/London", label: "Greenwich Mean Time (GMT)" },
            ]}
          />
          <SettingsSelect
            label="Date Format"
            description="Choose how dates are displayed"
            value={settings.dateFormat}
            onChange={(v) => updateSetting("dateFormat", v)}
            options={[
              { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
              { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
              { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
            ]}
          />
        </SettingsSection>

        {/* Security Section */}
        <SettingsSection
          title="Security"
          description="Protect your account"
          icon={Shield}
        >
          <SettingsToggle
            label="Two-Factor Authentication"
            description="Add an extra layer of security to your account"
            checked={settings.twoFactorAuth}
            onChange={(v) => updateSetting("twoFactorAuth", v)}
          />
          <SettingsSelect
            label="Session Timeout"
            description="Automatically log out after inactivity"
            value={settings.sessionTimeout}
            onChange={(v) => updateSetting("sessionTimeout", v)}
            options={[
              { value: "15", label: "15 minutes" },
              { value: "30", label: "30 minutes" },
              { value: "60", label: "1 hour" },
              { value: "120", label: "2 hours" },
              { value: "never", label: "Never" },
            ]}
          />
          <SettingsToggle
            label="Login Alerts"
            description="Get notified of new login attempts"
            checked={settings.loginAlerts}
            onChange={(v) => updateSetting("loginAlerts", v)}
          />
          <div className="mt-4 pt-4 border-t border-border space-y-2">
            <button className="w-full px-4 py-2.5 text-sm font-medium text-foreground bg-muted hover:bg-muted/80 rounded-lg transition-colors flex items-center justify-center gap-2">
              <Shield className="w-4 h-4" />
              View Security Log
            </button>
            <button className="w-full px-4 py-2.5 text-sm font-medium text-foreground bg-muted hover:bg-muted/80 rounded-lg transition-colors flex items-center justify-center gap-2">
              <Globe className="w-4 h-4" />
              Manage Active Sessions
            </button>
          </div>
        </SettingsSection>

        {/* Billing Section */}
        <SettingsSection
          title="Billing"
          description="Manage your subscription and payment methods"
          icon={CreditCard}
          defaultExpanded={false}
        >
          <div className="bg-muted/30 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Professional Plan</p>
                <p className="text-sm text-muted-foreground">$49/month • Renews Jan 15, 2026</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-sm font-medium">
                Active
              </span>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <button className="w-full px-4 py-2.5 text-sm font-medium text-foreground bg-muted hover:bg-muted/80 rounded-lg transition-colors">
              Upgrade Plan
            </button>
            <button className="w-full px-4 py-2.5 text-sm font-medium text-foreground bg-muted hover:bg-muted/80 rounded-lg transition-colors">
              Manage Payment Methods
            </button>
            <button className="w-full px-4 py-2.5 text-sm font-medium text-foreground bg-muted hover:bg-muted/80 rounded-lg transition-colors">
              View Billing History
            </button>
          </div>
        </SettingsSection>

        {/* Help & Support */}
        <SettingsSection
          title="Help & Support"
          description="Get help with using the application"
          icon={HelpCircle}
          defaultExpanded={false}
        >
          <div className="space-y-2">
            <button className="w-full px-4 py-2.5 text-sm font-medium text-foreground bg-muted hover:bg-muted/80 rounded-lg transition-colors text-left">
              📚 Documentation
            </button>
            <button className="w-full px-4 py-2.5 text-sm font-medium text-foreground bg-muted hover:bg-muted/80 rounded-lg transition-colors text-left">
              💬 Contact Support
            </button>
            <button className="w-full px-4 py-2.5 text-sm font-medium text-foreground bg-muted hover:bg-muted/80 rounded-lg transition-colors text-left">
              🐛 Report a Bug
            </button>
            <button className="w-full px-4 py-2.5 text-sm font-medium text-foreground bg-muted hover:bg-muted/80 rounded-lg transition-colors text-left">
              💡 Request a Feature
            </button>
          </div>
        </SettingsSection>

        {/* Danger Zone */}
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-xl p-5">
          <h3 className="font-semibold text-red-700 dark:text-red-400">Danger Zone</h3>
          <p className="text-sm text-red-600 dark:text-red-400/80 mt-1">
            Irreversible and destructive actions
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button className="px-4 py-2 text-sm font-medium text-red-600 border border-red-300 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Sign Out All Devices
            </button>
            <button className="px-4 py-2 text-sm font-medium text-red-600 border border-red-300 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
