"use client";

import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import "@ant-design/v5-patch-for-react-19";
import AttendanceTable from "@/app/component/Attendance/AttendanceTable";
import { Typography } from "antd";
import { useCustomNotification } from "@/app/hooks/UseCustomNotification";
import { useTranslation } from "react-i18next";
import UseFetchData from "@/app/hooks/UseFetchData";
import { User, UserTrackerRecord } from "@/app/constant/DataType";
import { today } from "@/app/constant/ConstantVariables";
import AttendanceFilters from "@/app/component/Attendance/AttendanceFilters";

export default function Attendance() {
  const { t } = useTranslation();
  const [selectedMonth, setSelectedMonth] = useState<dayjs.Dayjs>(today);

  const [users, setUsers] = useState<User[]>([]);
  const [userTrackers, setUserTrackers] = useState<UserTrackerRecord[]>([]);

  const [searchInput, setSearchInput] = useState("");
  const { openNotification, contextHolder } = useCustomNotification();

  const days = useMemo(() => {
    const daysInMonth = selectedMonth.daysInMonth();
    return Array.from({ length: daysInMonth }).map((_, index) => index + 1);
  }, [selectedMonth]);

  const { user, userTracker } = UseFetchData(selectedMonth);
  useEffect(() => {
    setUsers(user);
    setUserTrackers(userTracker);
  }, [user, userTracker]);

  const searchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleSearch = (value: string) => {
    setSearchInput(value);

    if (!value) {
      setUsers(user);
      setUserTrackers(userTracker);
      return;
    }
    const searchTerm = value.toLowerCase();

    const filteredUser = user.filter((u) => u.displayName.toLowerCase().includes(searchTerm));
    if (filteredUser.length === 0) {
      openNotification(t("Notice"), t("No suitable employee found!"));
      return;
    }

    const filteredIds = new Set(filteredUser.map((u) => u._id));
    const filteredUserTracker = userTracker.filter((ut) => filteredIds.has(ut.userId));

    setUsers(filteredUser);
    setUserTrackers(filteredUserTracker);
  };

  const handleDateChange = (value: dayjs.Dayjs | null) => {
    setSearchInput("");
    if (!value) {
      setSelectedMonth(today);
      return;
    }
    setSelectedMonth(value);
  };

  return (
    <>
      {contextHolder}
      <Typography.Title level={3} className="flex justify-center font-semibold">
        {t("Attendance statistics")}
      </Typography.Title>
      <AttendanceFilters
        searchInput={searchInput}
        selectedMonth={selectedMonth}
        searchChange={searchChange}
        handleSearch={handleSearch}
        handleDateChange={handleDateChange}
      />
      <AttendanceTable days={days} selectedMonth={selectedMonth} user={users} userTracker={userTrackers} />
    </>
  );
}
