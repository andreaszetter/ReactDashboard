import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";
import { Outlet } from "react-router";
import PageTransition from "./animations/PageTransition";

export default function DashboardLayout() {
  return (
    <div className="flex flex-col h-screen">
      <Header />

      <div className="flex flex-col md:flex-row w-full ">
        <Sidebar />
        <PageTransition >
          <Outlet />
        </PageTransition>
      </div>
    </div>
  );
}
