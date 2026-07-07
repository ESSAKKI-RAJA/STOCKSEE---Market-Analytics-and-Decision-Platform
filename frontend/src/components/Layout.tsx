import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import StatusBadge from "./StatusBadge";

export default function Layout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="bg-bg-primary text-text-primary min-h-screen font-body">
      <Topbar onMenuToggle={() => setSidebarOpen((o) => !o)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="pt-14 lg:pt-16 lg:ml-[240px] min-h-screen pb-8">
        <main
          key={location.pathname}
          className="animate-fade-in-up p-4 lg:p-6 overflow-x-hidden"
        >
          <div className="max-w-[1600px] mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Global status bar — always visible */}
      <StatusBadge />
    </div>
  );
}
