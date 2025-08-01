import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import LiveChat from "@/components/live-chat/LiveChat";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="dashboard" />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
      <LiveChat />
    </div>
  );
}