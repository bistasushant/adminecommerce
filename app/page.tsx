"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import SideBar from "@/components/SideBar";
import MobileSideBar from "@/components/MobileSideBar";
import Header from "@/components/Header";
import Stats from "@/components/Stats";
import Chart from "@/components/Chart";
import OrderProduct from "@/components/OrderProduct";

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const router = useRouter();

  const navigateToOrders = () => {
    router.push("/orders");
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-indigo-950">
      <SideBar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        navigateToOrders={navigateToOrders}
      />

      <MobileSideBar />

      <main
        className={`transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "md:ml-64" : "md:ml-20"
        }`}
      >
        <Header />
        <Stats />
        <Chart />
        <OrderProduct />
      </main>
    </div>
  );
}
