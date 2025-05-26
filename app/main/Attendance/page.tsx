"use client";

import Search from "antd/es/input/Search";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import "@ant-design/v5-patch-for-react-19";
import AttendanceTable from "@/app/component/Attendance/AttendanceTable";
import { DatePicker, Typography } from "antd";
import { useCustomNotification } from "@/app/hooks/UseCustomNotification";
import { useTranslation } from "react-i18next";
import UseFetchData from "@/app/hooks/UseFetchData";
import { DATE_FORMAT, DATE_HOUR_FORMAT } from "@/app/constant/DateFormatting";
import { User } from "@/app/constant/DataType";

export interface UserTrackerRecord {
  userId: string;
  records: {
    dateStr: string;
    checkIn: string;
    checkOut: string;
  }[];
}

export default function Attendance() {
  const { t } = useTranslation();
  const { user, tracker } = UseFetchData();

  const [originalUser, setOriginalUser] = useState<User[]>([]);
  const [originalUserTracker, setOriginalUserTracker] = useState<UserTrackerRecord[]>([]);

  const [users, setUsers] = useState<User[]>([]);
  const [userTracker, setUserTracker] = useState<UserTrackerRecord[]>([]);

  const [searchInput, setSearchInput] = useState("");
  const { openNotification, contextHolder } = useCustomNotification();

  const today = dayjs();
  const [selectedMonth, setSelectedMonth] = useState<dayjs.Dayjs>(today);

  const currentMonth = selectedMonth.month();
  const currentYear = selectedMonth.year();
  const days = useMemo(() => {
    const daysInMonth = selectedMonth.daysInMonth();
    return Array.from({ length: daysInMonth }, (_, index) => index + 1);
  }, [selectedMonth]);

  useEffect(() => {
    const userTrackerObject: Record<string, Record<string, { checkIn: string; checkOut: string }>> = {};

    tracker.forEach((track) => {
      const dateStr = dayjs(track.time).format(DATE_FORMAT);
      const userId = track.user;

      if (dayjs(track.time).month() === dayjs(selectedMonth).month() && dayjs(track.time).year() === dayjs(selectedMonth).year()) {
        if (!userTrackerObject[userId]) userTrackerObject[userId] = {};
        if (!userTrackerObject[userId][dateStr]) userTrackerObject[userId][dateStr] = { checkIn: "", checkOut: "" };
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

    Object.entries(userTrackerObject).forEach(([_, dates]) => {
      Object.entries(dates).forEach(([dateStr, record]) => {
        if (record.checkIn && !record.checkOut) {
          record.checkOut = dayjs(dateStr + " 18:00").format(DATE_HOUR_FORMAT);
        }
      });
    });

    const userTrackerArray: UserTrackerRecord[] = Object.entries(userTrackerObject)
      .map(([userId, dateStr]) => ({
        userId,
        records: Object.entries(dateStr).map(([dateStr, { checkIn, checkOut }]) => ({ dateStr, checkIn, checkOut })),
      }))
      .sort((a, b) => {
        const nameA = user.find((u) => u._id === a.userId)?.displayName || "";
        const nameB = user.find((u) => u._id === b.userId)?.displayName || "";
        return nameA.localeCompare(nameB);
      });

    setOriginalUser(user);
    setOriginalUserTracker(userTrackerArray);

    setUsers(user);
    setUserTracker(userTrackerArray);
  }, [tracker, user, selectedMonth]);

  const searchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleSearch = (value: string) => {
    setSearchInput(value);
    if (!value) {
      setUsers(originalUser);
      setUserTracker(originalUserTracker);
      return;
    }
    const searchTerm = value.toLowerCase();

    const filteredUser = originalUser.filter((u) => u.displayName.toLowerCase().includes(searchTerm));
    if (filteredUser.length === 0) {
      openNotification(t("Notice"), t("No suitable employee found!"));
      return;
    }

    const filteredIds = new Set(filteredUser.map((u) => u._id));
    const filteredUserTracker = originalUserTracker.filter((ut) => filteredIds.has(ut.userId));

    setUsers(filteredUser);
    setUserTracker(filteredUserTracker);
  };

  const handleDateChange = (value: dayjs.Dayjs | null) => {
    if (!value) {
      setSelectedMonth(today);
      return;
    }
    setSelectedMonth(value);
  };

  return (
    <>
      {contextHolder}
      <Typography.Title level={3} className="flex justify-center font-semibold my-3">
        {t("Attendance statistics")}
      </Typography.Title>
      <Search
        placeholder={t("Search employee")}
        style={{ width: "300px", marginBottom: 12 }}
        value={searchInput}
        onChange={searchChange}
        onSearch={() => handleSearch(searchInput)}
        enterButton
      />
      <DatePicker picker="month" style={{ marginLeft: "20px" }} value={selectedMonth} onChange={handleDateChange} />
      <AttendanceTable days={days} currentMonth={currentMonth} currentYear={currentYear} user={users} userTracker={userTracker} />
    </>
  );
}
