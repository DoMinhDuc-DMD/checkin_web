"use client";
import dayjs from "dayjs";
import axios from "axios";
import { Tracker, User, UserTrackerRecord } from "../constant/DataType";
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

export default function UseFetchData(selectedMonth?: dayjs.Dayjs | null) {
  const [user, setUser] = useState<User[]>([]);
  const [tracker, setTracker] = useState<Tracker[]>([]);
  const [userTracker, setUserTracker] = useState<UserTrackerRecord[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await axios.get(`${apiLink}/users/?limit=140`);
        const trackerData = await axios.get(
          `${apiLink}/trackers/?gte=Fri%20May%2021%202021%2000:00:00%20GMT+0700%20(Indochina%20Time)&lte=${todayDayName}%20${todayMonthName}%20${todayDate}%20${todayYear}%2023:59:59%20GMT+0700%20(Indochina%20Time)&limit=30000`
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
              if (dayjs(record.checkIn).hour() >= 18) {
                delete dates[dateStr];
              } else {
                // Nếu hôm đó đã qua, tự động gán check-out là 18:00
                if (today.isAfter(endOfDay)) {
                  record.checkOut = dayjs(`${dateStr} 18:00`).format(DATE_HOUR_FORMAT);
                } else {
                  record.checkOut = "";
                }
              }
            }
          });
        });

        // Sắp xếp theo tên nhân viên
        const userTrackerArray: UserTrackerRecord[] = Object.entries(userTrackerObject)
          .map(([userId, dateStr]) => ({
            userId,
            records: Object.entries(dateStr).map(([dateStr, { checkIn, checkOut }]) => ({ dateStr, checkIn, checkOut })),
          }))
          .sort((a, b) => {
            const nameA = users.find((u) => u._id === a.userId)?.displayName || "";
            const nameB = users.find((u) => u._id === b.userId)?.displayName || "";
            return nameA.localeCompare(nameB);
          });
        setUser(users);
        setTracker(trackers);
        setUserTracker(userTrackerArray);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [selectedMonth]);
  return { user, tracker, userTracker };
}
