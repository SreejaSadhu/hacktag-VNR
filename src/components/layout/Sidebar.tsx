import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Sparkles,
  Globe,
  Users,
  Mail,
  Bot,
  MessageSquare,
  BarChart3,
  Users2,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const navigationItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Generate Website",
    href: "/dashboard/generate",
    icon: Sparkles,
  },
  {
    title: "My Websites",
    href: "/dashboard/websites",
    icon: Globe,
  },
  {
    title: "Influencer Match",
    href: "/dashboard/influencer",
    icon: Users,
  },
  {
    title: "Email Marketing",
    href: "/dashboard/email",
    icon: Mail,
  },
  {
    title: "Chatbot",
    href: "/dashboard/chatbot",
    icon: Bot,
  },
  {
    title: "Feedback Analyzer",
    href: "/dashboard/feedback",
    icon: MessageSquare,
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    title: "Community",
    href: "/dashboard/community",
    icon: Users2,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "relative flex flex-col border-r bg-background transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Collapse Toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 z-10 h-6 w-6 rounded-full border bg-background shadow-md"
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </Button>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigationItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.href === "/dashboard"}
            className={({ isActive }) =>
              cn(
                "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent group",
                isActive
                  ? "bg-gradient-primary text-primary-foreground shadow-soft"
                  : "text-muted-foreground hover:text-foreground",
                collapsed && "justify-center px-2"
              )
            }
          >
            <item.icon className={cn("h-4 w-4", !collapsed && "mr-3")} />
            {!collapsed && (
              <span className="transition-all duration-300">{item.title}</span>
            )}
            {collapsed && (
              <span className="sr-only">{item.title}</span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Section */}
      {!collapsed && (
        <div className="p-4 border-t">
          <div className="rounded-lg bg-gradient-secondary p-4 text-sm">
            <h4 className="font-medium mb-2">Upgrade to Pro</h4>
            <p className="text-xs text-muted-foreground mb-3">
              Unlock unlimited websites and advanced features.
            </p>
            <Button size="sm" variant="outline" className="w-full">
              Upgrade Now
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}