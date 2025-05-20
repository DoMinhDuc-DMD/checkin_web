"use client";

import { dataSource } from "../TestData/data";
import { DatePicker, Flex } from "antd";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, BarElement, ArcElement, Title, Tooltip, Legend } from "chart.js";
import dayjs from "dayjs";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import PieChart from "../component/Dashboard/PieChart";
import CountCard from "../component/Dashboard/CountCard";
import { CalculateWorkMinute } from "../utils/CalculateWorkMinute";
ChartJS.register(CategoryScale, LinearScale, PointElement, BarElement, ArcElement, Title, Tooltip, Legend);

export default function NewDashboard() {
  const { t } = useTranslation();
  const today = dayjs();

  const [todayAttendance, setTodayAttendance] = useState<number>();
  const [attendanceCount, setAttendanceCount] = useState({ onTime: 0, late: 0, early: 0 });
  const [analyzeDept, setAnalyzeDept] = useState({
    onTimeAime: 0,
    onTimeVikoi: 0,
    lateAime: 0,
    lateVikoi: 0,
    earlyAime: 0,
    earlyVikoi: 0,
  });
  const [dateMode, setDateMode] = useState<"date" | "month">("date");
  const [analyzeDate, setAnalyzeDate] = useState<dayjs.Dayjs | null>(today);

  const [workingMonth, setWorkingMonth] = useState<dayjs.Dayjs | null>(today);
  const [overtimeMonth, setOvertimeMonth] = useState<dayjs.Dayjs | null>(today);

  const [workingTime, setWorkingTime] = useState({ Aime: 0, Vikoi: 0 });
  const [overtime, setOvertime] = useState({ Aime: 0, Vikoi: 0 });

  const handleDateModeChange = (value: string) => {
    if (value === "date") {
      setDateMode("date");
    } else setDateMode("month");
  };

  const handleAnalyzeDateChange = (value: dayjs.Dayjs | null) => {
    setAnalyzeDate(value);
  };
  const handleWorkingMonthChange = (value: dayjs.Dayjs | null) => {
    setWorkingMonth(value);
  };
  const handleOvertimeMonthChange = (value: dayjs.Dayjs | null) => {
    setOvertimeMonth(value);
  };

  useEffect(() => {
    let attendance = 0;
    const attendanceCounts = { onTime: 0, late: 0, early: 0 };
    const analyzeCounts = { onTimeAime: 0, onTimeVikoi: 0, lateAime: 0, lateVikoi: 0, earlyAime: 0, earlyVikoi: 0 };
    const workingMinutes = { Aime: 0, Vikoi: 0 };
    const overtimeMinutes = { Aime: 0, Vikoi: 0 };

    dataSource.forEach((d) => {
      for (let i = 0; i < d.employee_check_in.length; i++) {
        const checkInRaw = d.employee_check_in[i];
        const checkOutRaw = d.employee_check_out[i];

        const [dateInStr, checkInTime] = checkInRaw.split(", ");
        const checkOutTime = checkOutRaw.split(", ")[1];
        const deptKey = d.employee_department === "Aimesoft" ? "Aime" : "Vikoi";
        // Card
        if (dateInStr === today.format("YYYY-MM-DD")) {
          attendance++;
          if (checkInTime <= "08:30") attendanceCounts[`onTime`]++;
          else attendanceCounts[`late`]++;
          if (checkOutTime < "18:00") attendanceCounts[`early`]++;
        }
        // Analyze Chart
        if (dateMode === "date") {
          if (analyzeDate?.format("YYYY-MM-DD") === dateInStr) {
            if (checkInTime <= "08:30") analyzeCounts[`onTime${deptKey}`]++;
            else analyzeCounts[`late${deptKey}`]++;
            if (checkOutTime < "18:00") analyzeCounts[`early${deptKey}`]++;
          }
        } else if (dateMode === "month") {
          if (analyzeDate?.format("YYYY-MM") === dayjs(dateInStr).format("YYYY-MM")) {
            if (checkInTime <= "08:30") analyzeCounts[`onTime${deptKey}`]++;
            else analyzeCounts[`late${deptKey}`]++;
            if (checkOutTime < "18:00") analyzeCounts[`early${deptKey}`]++;
          }
        }
        // Work and overtime chart
        const diffMinutes = CalculateWorkMinute(checkInRaw, checkOutRaw);
        if (workingMonth?.format("YYYY-MM") === dayjs(dateInStr).format("YYYY-MM")) {
          workingMinutes[deptKey] += diffMinutes;
        }
        if (diffMinutes > 480 && overtimeMonth?.format("YYYY-MM") === dayjs(dateInStr).format("YYYY-MM")) {
          overtimeMinutes[deptKey] += diffMinutes - 480;
        }
      }
    });
    setTodayAttendance(dataSource.length > 0 ? Number(((attendance / dataSource.length) * 100).toFixed(2)) : Number((0).toFixed(2)));

    setAttendanceCount(attendanceCounts);
    setAnalyzeDept(analyzeCounts);
    setWorkingTime({
      Aime: Number((workingMinutes.Aime / 60).toFixed(2)),
      Vikoi: Number((workingMinutes.Vikoi / 60).toFixed(2)),
    });
    setOvertime({
      Aime: Number((overtimeMinutes.Aime / 60).toFixed(2)),
      Vikoi: Number((overtimeMinutes.Vikoi / 60).toFixed(2)),
    });
  }, [dataSource, dateMode, analyzeDate, workingMonth, overtimeMonth]);

  const analyzeData = {
    labels: ["Đúng giờ", "Đến muộn", "Về sớm"],
    datasets: [
      { label: "Aime Dept", data: [analyzeDept.onTimeAime, analyzeDept.lateAime, analyzeDept.earlyAime], backgroundColor: "blue" },
      { label: "Vikoi Dept", data: [analyzeDept.onTimeVikoi, analyzeDept.lateVikoi, analyzeDept.earlyVikoi], backgroundColor: "pink" },
    ],
  };
  const workTimeData = {
    labels: ["Aime Dept", "Vikoi Dept"],
    datasets: [{ data: [workingTime.Aime, workingTime.Vikoi], backgroundColor: ["blue", "pink"] }],
  };
  const overtimeData = {
    labels: ["Aime Dept", "Vikoi Dept"],
    datasets: [{ data: [overtime.Aime, overtime.Vikoi], backgroundColor: ["blue", "pink"] }],
  };

  return (
    <Flex gap={20} vertical>
      <Flex justify="space-between" align="center">
        <Link href="/main/Attendance" className="w-[23%]">
          <CountCard label="Attendance" attendancePercentage={todayAttendance} />
        </Link>
        <CountCard label="On time" attendanceCountType={attendanceCount.onTime} />
        <CountCard label="In late" attendanceCountType={attendanceCount.late} />
        <CountCard label="Out early" attendanceCountType={attendanceCount.early} />
      </Flex>
      <Flex justify="space-between">
        <div className="w-[31%] min-h-[300px] bg-gray-200 p-5 rounded">
          <strong className="text-lg">{t("Attendance analytic")}</strong>
          <Flex justify="space-between">
            <select onChange={(e) => handleDateModeChange(e.target.value)} className="w-[100px] bg-white rounded">
              <option value="date">Ngày</option>
              <option value="month">Tháng</option>
            </select>
            <DatePicker picker={dateMode} value={analyzeDate} onChange={handleAnalyzeDateChange} />
          </Flex>
          <div className="h-[300px]">
            <Bar data={analyzeData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        <PieChart
          label="Department work hours"
          selectedMonth={workingMonth}
          typeData={workTimeData}
          handleWorkingMonthChange={handleWorkingMonthChange}
        />
        <PieChart
          label="Department overtime hours"
          selectedMonth={overtimeMonth}
          typeData={overtimeData}
          handleWorkingMonthChange={handleOvertimeMonthChange}
        />
      </Flex>
    </Flex>
  );
}
