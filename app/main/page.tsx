"use client";

import { Card, DatePicker, Flex } from "antd";
import { useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, BarElement, ArcElement, Title, Tooltip, Legend } from "chart.js";
import Link from "next/link";
ChartJS.register(CategoryScale, LinearScale, PointElement, BarElement, ArcElement, Title, Tooltip, Legend);

export default function NewDashboard() {
  const [dateMode, setDateMode] = useState<"date" | "month">("date");
  const handleDateModeChange = (value: string) => {
    if (value === "date") {
      setDateMode("date");
    } else if (value === "month") {
      setDateMode("month");
    }
  };

  const attendanceData = {
    labels: ["Đúng giờ", "Đến muộn", "Về sớm"],
    datasets: [
      { label: "Aime Dept", data: [1, 2, 3], backgroundColor: "rgba(54, 162, 235, 0.6)" },
      { label: "Vikoi Dept", data: [3, 2, 1], backgroundColor: "rgba(54, 162, 235, 0.6)" },
    ],
  };
  const workTimeData = {
    labels: ["Aime Dept", "Vikoi Dept"],
    datasets: [{ data: [70, 30], backgroundColor: ["rgba(54, 162, 235, 0.6)", "rgba(176, 79, 158, 0.3)"], hworkOffset: 4 }],
  };

  return (
    <Flex gap={20} vertical>
      <Flex justify="space-between" align="center">
        <Link href="/main/Attendance" className="w-[23%]">
          <Card hoverable style={{ backgroundColor: "oklch(0.93 0.01 0)", width: "full", height: "100px" }}>
            <p>Chấm công hôm nay</p>
            <p>20%</p>
          </Card>
        </Link>
        <Card className="w-[23%] h-[100px]" hoverable style={{ backgroundColor: "oklch(0.93 0.01 0)" }}>
          <p>Đúng giờ</p>
          <p>10</p>
        </Card>
        <Card className="w-[23%] h-[100px]" hoverable style={{ backgroundColor: "oklch(0.93 0.01 0)" }}>
          <p>Muộn giờ</p>
          <p>10</p>
        </Card>
        <Card className="w-[23%] h-[100px]" hoverable style={{ backgroundColor: "oklch(0.93 0.01 0)" }}>
          <p>Về sớm</p>
          <p>10</p>
        </Card>
      </Flex>
      <div className="flex justify-between">
        <div className="w-[31%] min-h-[300px] bg-gray-200 p-5">
          <p>Phân tích chấm công</p>
          <select onChange={(e) => handleDateModeChange(e.target.value)}>
            <option value="date">Ngày</option>
            <option value="month">Tháng</option>
          </select>
          <DatePicker picker={dateMode} />
          <Bar data={attendanceData} />
        </div>
        <div className="w-[31%] min-h-[300px] bg-gray-200 p-5">
          <p>Biểu đồ giờ làm trong tháng của phòng ban</p>
          <DatePicker picker="month" />
          <Pie data={workTimeData} />
        </div>
        <div className="w-[31%] min-h-[300px] bg-gray-200 p-5">
          <p>Biểu đồ tăng ca trong tháng của phòng ban</p>
          <DatePicker picker="month" />
          <Pie data={workTimeData} />
        </div>
      </div>
    </Flex>
  );
}
