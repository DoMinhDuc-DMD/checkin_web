"use client";

import { DatePicker, Divider, Flex, List } from "antd";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, BarElement, ArcElement, Title, Tooltip, Legend } from "chart.js";
import dayjs from "dayjs";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import CountCard from "../component/Dashboard/CountCard";
import { User } from "../constant/DataType";
ChartJS.register(CategoryScale, LinearScale, PointElement, BarElement, ArcElement, Title, Tooltip, Legend);
import UseFetchData from "../hooks/UseFetchData";

export default function NewDashboard() {
  const { t } = useTranslation();
  const { user, tracker } = UseFetchData();

  const [todayAttendance, setTodayAttendance] = useState<number>();
  const [attendanceCount, setAttendanceCount] = useState({ onTime: 0, inLate: 0, outEarly: 0 });

  const [absentEmployee, setAbsentEmployee] = useState<User[]>([]);

  const [analyzeDate, setAnalyzeDate] = useState<dayjs.Dayjs | null>(dayjs());
  const [analyzeTracker, setAnalyzeTracker] = useState({ onTime: 0, inLate: 0, outEarly: 0 });

  useEffect(() => {
    if (!analyzeDate) return;
    let checkAttendance = { onTime: 0, inLate: 0, outEarly: 0 };

    const morningShiftStart = dayjs(analyzeDate).hour(8).minute(31);
    const afternoonShiftEnd = dayjs(analyzeDate).hour(18).minute(0);

    const firstCheckIn: Record<string, dayjs.Dayjs> = {};
    const firstCheckOut: Record<string, dayjs.Dayjs> = {};

    tracker.forEach((t) => {
      const checkTime = dayjs(t.time);
      const userId = t.user;

      if (checkTime.isSame(analyzeDate, "day")) {
        if (t.type === "checkIn") {
          if (!firstCheckIn[userId] || checkTime.isBefore(firstCheckIn[userId])) {
            firstCheckIn[userId] = checkTime;
          }
        } else if (t.type === "checkOut") {
          if (!firstCheckOut[userId] || checkTime.isBefore(firstCheckOut[userId])) {
            firstCheckOut[userId] = checkTime;
          }
        }
      }
    });

    Object.values(firstCheckIn).forEach((checkIn) => {
      if (checkIn.isBefore(morningShiftStart)) checkAttendance.onTime++;
      else checkAttendance.inLate++;
    });

    Object.values(firstCheckOut).forEach((checkOut) => {
      if (checkOut.isBefore(afternoonShiftEnd)) checkAttendance.outEarly++;
    });

    const attendedUserId = Object.keys(firstCheckIn);
    const absent = user.filter((u) => !attendedUserId.includes(u._id));
    setAbsentEmployee(absent);

    if (dayjs(analyzeDate).isSame(dayjs(), "day")) {
      setTodayAttendance(((checkAttendance.onTime + checkAttendance.inLate) / user.length) * 100);
      setAttendanceCount(checkAttendance);
    }

    setAnalyzeTracker(checkAttendance);
  }, [user, tracker, analyzeDate]);

  const handleAnalyzeDateChange = (value: dayjs.Dayjs | null) => {
    if (!value) {
      setAnalyzeDate(dayjs());
      return;
    }
    setAnalyzeDate(value);
  };

  const analyzeData = {
    labels: ["Đúng giờ", "Đến muộn", "Về sớm"],
    datasets: [
      { label: "Nhân viên", data: [analyzeTracker.onTime, analyzeTracker.inLate, analyzeTracker.outEarly], backgroundColor: "blue" },
    ],
  };

  return (
    <Flex gap={20} vertical>
      <Flex justify="space-between" align="center">
        <Link href="/main/Attendance" className="w-[23%]">
          <CountCard label="Attendance" attendancePercentage={todayAttendance} />
        </Link>
        <CountCard label="On time" attendanceCountType={attendanceCount.onTime} />
        <CountCard label="In late" attendanceCountType={attendanceCount.inLate} />
        <CountCard label="Out early" attendanceCountType={attendanceCount.outEarly} />
      </Flex>{" "}
      <Flex>
        <DatePicker value={analyzeDate} onChange={handleAnalyzeDateChange} />
      </Flex>
      <Flex gap={50}>
        <div className="w-[31%] min-h-[400px] bg-gray-200 p-5 rounded">
          <strong className="text-lg">{t("Attendance analytic")}</strong>

          <div className="h-[300px]">
            <Bar data={analyzeData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="w-[31%] min-h-[400px] bg-gray-200 p-5 rounded">
          <strong className="text-lg">{t("Employee absence")}</strong>
          <Divider style={{ borderColor: "black", marginTop: 10, marginBottom: 16 }}></Divider>
          <List
            style={{ height: "300px", overflowY: "scroll" }}
            bordered
            dataSource={absentEmployee}
            renderItem={(item) => (
              <List.Item>
                <strong>{item.displayName}</strong>
                {/* <Button type="primary">1</Button> */}
              </List.Item>
            )}
          />
        </div>
      </Flex>
    </Flex>
  );
}
