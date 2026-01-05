/**
 * ShellPreview - Preview wrapper for the application shell
 * 
 * This file is NOT exported - it's used only for local preview.
 */
import { useState } from "react";
import { AppShell } from "./components/AppShell";
import {
  Users,
  Calendar,
  Settings,
  LayoutDashboard,
  FileText,
  Bell,
  CreditCard,
  HelpCircle,
} from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    label: "Patients",
    href: "/patients",
    icon: <Users className="w-5 h-5" />,
    badge: "128",
  },
  {
    label: "Appointments",
    href: "/appointments",
    icon: <Calendar className="w-5 h-5" />,
    badge: "3",
  },
  {
    label: "Reports",
    href: "/reports",
    icon: <FileText className="w-5 h-5" />,
  },
  {
    label: "Notifications",
    href: "/notifications",
    icon: <Bell className="w-5 h-5" />,
    badge: "5",
  },
  {
    label: "Billing",
    href: "/billing",
    icon: <CreditCard className="w-5 h-5" />,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: <Settings className="w-5 h-5" />,
  },
  {
    label: "Help & Support",
    href: "/help",
    icon: <HelpCircle className="w-5 h-5" />,
  },
];

const sampleUser = {
  name: "Dr. Jane Smith",
  email: "jane.smith@clinic.com",
  role: "Administrator",
};

export default function ShellPreview() {
  const [currentPath, setCurrentPath] = useState("/dashboard");

  const handleNavigate = (href: string) => {
    setCurrentPath(href);
    console.log("Navigate to:", href);
  };

  const handleLogout = () => {
    console.log("Logout clicked");
  };

  const currentPage = navItems.find((item) => item.href === currentPath);

  return (
    <AppShell
      navItems={navItems}
      user={sampleUser}
      currentPath={currentPath}
      appName="DentistCRM"
      onNavigate={handleNavigate}
      onLogout={handleLogout}
    >
      <div className="p-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            {currentPage?.label || "Dashboard"}
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's what's happening today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Patients", value: "1,284", change: "+12%" },
            { label: "Appointments Today", value: "24", change: "+3" },
            { label: "Revenue (MTD)", value: "$42,850", change: "+18%" },
            { label: "Pending Tasks", value: "8", change: "-2" },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="p-5 rounded-xl border border-border bg-card animate-in fade-in slide-in-from-bottom-2"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <div className="flex items-end justify-between mt-2">
                <span className="text-2xl font-bold text-foreground">
                  {stat.value}
                </span>
                <span className="text-xs font-medium text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Content Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2 p-6 rounded-xl border border-border bg-card">
            <h3 className="font-semibold text-foreground mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {[
                { action: "New patient registered", time: "2 min ago", type: "patient" },
                { action: "Appointment completed", time: "15 min ago", type: "appointment" },
                { action: "Invoice paid", time: "1 hour ago", type: "billing" },
                { action: "Prescription created", time: "2 hours ago", type: "report" },
              ].map((activity, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-3 rounded-lg bg-muted/30"
                >
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <div className="flex-1">
                    <p className="text-sm text-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-6 rounded-xl border border-border bg-card">
            <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { label: "Add New Patient", icon: Users },
                { label: "Schedule Appointment", icon: Calendar },
                { label: "Create Report", icon: FileText },
                { label: "Send Notification", icon: Bell },
              ].map((action, i) => (
                <button
                  key={i}
                  className="w-full flex items-center gap-3 p-3 text-left rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <action.icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {action.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
