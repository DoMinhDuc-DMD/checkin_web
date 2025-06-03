"use client";
import { today } from "@/app/constant/ConstantVariables";
import { Tracker, User } from "@/app/constant/DataType";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

interface AnalyzeDataProps {
  user: User[];
  tracker: Tracker[];
  analyzeDate: dayjs.Dayjs;
}

export default function AnalyzeData({ user, tracker, analyzeDate }: AnalyzeDataProps) {
  const [todayAttendance, setTodayAttendance] = useState<number>(0);
  const [attendanceCount, setAttendanceCount] = useState({ onTime: 0, inLate: 0, outEarly: 0 });
  const [analyzeTracker, setAnalyzeTracker] = useState({ onTime: 0, inLate: 0, outEarly: 0 });

  const [attendedEmployee, setAttendedEmployee] = useState<{ user: User; firstCheckIn: dayjs.Dayjs }[]>([]);
  const [absentEmployee, setAbsentEmployee] = useState<User[]>([]);

  useEffect(() => {
    if (!analyzeDate) return;
    const checkAttendance = { onTime: 0, inLate: 0, outEarly: 0 };

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
    const attended = user
      .filter((u) => attendedUserId.includes(u._id))
      .map((u) => ({ user: u, firstCheckIn: firstCheckIn[u._id] }))
      .sort((a, b) => a.firstCheckIn.hour() * 60 + a.firstCheckIn.minute() - (b.firstCheckIn.hour() * 60 + b.firstCheckIn.minute()));
    const absent = user.filter((u) => !attendedUserId.includes(u._id));

    if (dayjs(analyzeDate).isSame(today, "day")) {
      setTodayAttendance(((checkAttendance.onTime + checkAttendance.inLate) / user.length) * 100);
      setAttendanceCount(checkAttendance);
    }

    setAttendedEmployee(attended);
    setAbsentEmployee(absent);
    setAnalyzeTracker(checkAttendance);
  }, [user, tracker, analyzeDate]);

  return { todayAttendance, attendanceCount, attendedEmployee, absentEmployee, analyzeTracker };
}
