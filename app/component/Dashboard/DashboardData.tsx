"use client";

import { DashboardProps } from "@/app/main/Dashboard/page";
import { dataCheckIn } from "@/app/TestData/Dashboard/data";
import dayjs from "dayjs";

export default function DashboardData({ gridCols, days, currentMonth, currentYear }: DashboardProps) {
  return (
    <div>
      <div className={`grid ${gridCols}`}>
        {days?.map((day) => (
          <div key={day} className="border text-center py-2 font-semibold">
            {dayjs(`${currentYear}-${currentMonth}-${day}`).format("DD/MM")}
          </div>
        ))}
      </div>

      {dataCheckIn?.map((emp) => (
        <div key={emp.key} className={`grid ${gridCols}`}>
          {days?.map((day) => {
            const workHours = emp.employee_check[day - 1];
            return (
              <div key={day} className="border text-center py-2">
                {workHours > 0 ? <span className="text-green-500">{workHours}</span> : <span className="text-red-500">0</span>}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
