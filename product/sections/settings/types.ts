// Settings Types for the Settings Section

export type Theme = "light" | "dark" | "system";
export type BillingStatus = "active" | "past_due" | "cancelled";

export interface ProfileSettings {
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: string;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  appointmentReminders: boolean;
  marketingEmails: boolean;
}

export interface AppearanceSettings {
  theme: Theme;
  language: string;
  timezone: string;
  dateFormat: string;
}

export interface SecuritySettings {
  twoFactorAuth: boolean;
  sessionTimeout: string;
  loginAlerts: boolean;
  lastPasswordChange: string;
}

export interface UserSettings {
  profile: ProfileSettings;
  notifications: NotificationSettings;
  appearance: AppearanceSettings;
  security: SecuritySettings;
}

export interface PaymentMethod {
  type: "card" | "bank";
  last4: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
}

export interface BillingInfo {
  plan: string;
  price: number;
  currency: string;
  interval: "month" | "year";
  renewalDate: string;
  status: BillingStatus;
  paymentMethod: PaymentMethod;
}

export interface SettingsOption {
  value: string;
  label: string;
}

export interface SettingsOptions {
  themes: SettingsOption[];
  languages: SettingsOption[];
  timezones: SettingsOption[];
  dateFormats: SettingsOption[];
  sessionTimeouts: SettingsOption[];
}

export interface SettingsData {
  settings: UserSettings;
  billing: BillingInfo;
  options: SettingsOptions;
}
