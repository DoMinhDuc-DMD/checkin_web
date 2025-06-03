"use client";
import dayjs from "dayjs";
import axios from "axios";
import { DataType, Tracker, User } from "../constant/DataType";
import { useEffect, useState } from "react";
import {
  apiLink,
  DATE_FORMAT,
  DATE_HOUR_FORMAT,
  today,
  todayDate,
  todayDayName,
  todayMonthName,
  todayYear,
} from "../constant/ConstantVariables";
import { useTranslation } from "react-i18next";

export default function UseFetchData(selectedMonth?: dayjs.Dayjs | null) {
  const { t } = useTranslation();
  const [user, setUser] = useState<User[]>([]);
  const [tracker, setTracker] = useState<Tracker[]>([]);
  const [userTracker, setUserTracker] = useState<DataType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const userData = await axios.get(`${apiLink}/users/?limit=120`);
        const trackerData = await axios.get(
          `${apiLink}/trackers/?gte=Fri%20May%2021%202021%2000:00:00%20GMT+0700%20(Indochina%20Time)&lte=${todayDayName}%20${todayMonthName}%20${todayDate}%20${todayYear}%2023:59:59%20GMT+0700%20(Indochina%20Time)&limit=10000`
        );

        const users: User[] = userData.data.data
          .filter((u: User) => u.role === "staff")
          .sort((a: User, b: User) => a.displayName.localeCompare(b.displayName));
        const trackers: Tracker[] = trackerData.data.data;

        // Gộp dữ liệu user tracker
        const userTrackerObject: Record<string, Record<string, { checkIn: string; checkOut: string }>> = {};

        trackers.forEach((track) => {
          const dateStr = dayjs(track.time).format(DATE_FORMAT);
          const userId = track.user;

          if (dayjs(track.time).month() === dayjs(selectedMonth).month() && dayjs(track.time).year() === dayjs(selectedMonth).year()) {
            if (!userTrackerObject[userId]) userTrackerObject[userId] = {};
            if (!userTrackerObject[userId][dateStr]) userTrackerObject[userId][dateStr] = { checkIn: "", checkOut: "" };
            // Lấy bản ghi check in, check out đầu tiên của ngày
            if (track.type === "checkIn") {
              const current = userTrackerObject[userId][dateStr].checkIn;
              if (!current || dayjs(track.time).isBefore(dayjs(current))) {
                userTrackerObject[userId][dateStr].checkIn = dayjs(track.time).format(DATE_HOUR_FORMAT);
              }
            } else if (track.type === "checkOut") {
              const current = userTrackerObject[userId][dateStr].checkOut;
              if (!current || dayjs(track.time).isBefore(dayjs(current))) {
                userTrackerObject[userId][dateStr].checkOut = dayjs(track.time).format(DATE_HOUR_FORMAT);
              }
            }
          }
        });
        // Lọc qua từng bản ghi chấm công và đặt giá trị cho check out nếu chưa có
        Object.entries(userTrackerObject).forEach(([_, dates]) => {
          Object.entries(dates).forEach(([dateStr, record]) => {
            if (record.checkIn && !record.checkOut) {
              const endOfDay = dayjs(dateStr).endOf("day");

              // Nếu check-in sau 18:00 thì xóa bản ghi hôm đó
              if (dayjs(record.checkIn).hour() >= 18) delete dates[dateStr];
              // Nếu qua 12 giờ đêm, tự động gán check-out là 18:00
              else record.checkOut = today.isAfter(endOfDay) ? dayjs(`${dateStr} 18:00`).format(DATE_HOUR_FORMAT) : "";
            }
          });
        });

        const result: DataType[] = [];
        // Tạo dữ liệu nhân viên
        Object.entries(userTrackerObject)
          .sort((a, b) => {
            const nameA = users.find((u) => u._id === a[0])?.displayName || "";
            const nameB = users.find((u) => u._id === b[0])?.displayName || "";
            return nameA.localeCompare(nameB);
          })
          .forEach(([userId, records]) => {
            const user = users.find((u) => u._id === userId);
            if (!user) return;

            const dataResult: DataType = {
              userId,
              displayName: user.displayName,
              email: user.email,
              role: user.role,
              createdAt: user.createdAt,
              checkInLateCount: 0,
              checkOutEarlyCount: 0,
              trackRecord: [],
            };

            // Các bản ghi chấm công của nhân viên
            Object.entries(records).forEach(([dateStr, { checkIn, checkOut }]) => {
              const isInLate = dayjs(checkIn).isAfter(dayjs(dateStr).hour(8).minute(30));
              const isOutEarly = dayjs(checkOut).isBefore(dayjs(dateStr).hour(18));

              if (isInLate || isOutEarly) {
                const type = isInLate && isOutEarly ? t("In late, out early") : isInLate ? t("In late") : t("Out early");
                if (isInLate) dataResult.checkInLateCount++;
                if (isOutEarly) dataResult.checkOutEarlyCount++;

                dataResult.trackRecord.push({
                  date: dateStr,
                  checkIn: checkIn,
                  checkOut: checkOut,
                  typeMistake: type,
                });
              }
            });
            result.push(dataResult);
          });
        setUser(users);
        setTracker(trackers);
        setUserTracker(result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedMonth]);
  return { user, tracker, userTracker, loading };
}
