"use client";

import DashboardData from "@/app/component/Dashboard/DashboardData";
import DashboardInfo from "@/app/component/Dashboard/DashboardInfo";

export interface DashboardProps {
  gridCols?: string;
  days?: number[];
  currentMonth?: number;
  currentYear?: number;
}

export default function Dashboard() {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, index) => index + 1);
  const gridCols = { 28: "grid-cols-28", 29: "grid-cols-29", 30: "grid-cols-30", 31: "grid-cols-31" }[daysInMonth] || "grid-cols-31";

  return (
    <>
      <div className="flex justify-center text-2xl font-semibold my-3">Thống kê chấm công</div>
      <div className="overflow-x-auto h-[90%]">
        <div className="min-w-[1200px] grid grid-cols-[500px_120%]">
          <DashboardInfo />
          <DashboardData gridCols={gridCols} days={days} currentMonth={currentMonth} currentYear={currentYear} />
        </div>
      </div>
    </>
  );
}
