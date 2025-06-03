"use client";

import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import "@ant-design/v5-patch-for-react-19";
import AttendanceTable from "@/app/component/Attendance/AttendanceTable";
import { Typography } from "antd";
import { useCustomNotification } from "@/app/hooks/UseCustomNotification";
import { useTranslation } from "react-i18next";
import UseFetchData from "@/app/hooks/UseFetchData";
import { DataType } from "@/app/constant/DataType";
import { today } from "@/app/constant/ConstantVariables";
import Filters from "@/app/component/Filters";

export default function Attendance() {
  const { t } = useTranslation();
  // Lấy data
  const [selectedMonth, setSelectedMonth] = useState<dayjs.Dayjs>(today);
  const { userTracker, loading } = UseFetchData(selectedMonth);
  const [data, setData] = useState<DataType[]>([]);
  useEffect(() => {
    setData(userTracker);
  }, [userTracker]);
  // Search
  const [searchInput, setSearchInput] = useState("");
  const { openNotification, contextHolder } = useCustomNotification();
  // Checkbox
  const [selectedRow, setSelectedRow] = useState<DataType[]>([]);
  const isSelectedAll = selectedRow.length === data.length && data.length > 0;
  const handleSelectAll = () => {
    setSelectedRow(isSelectedAll ? [] : data);
  };
  const handleCheckboxChange = (row: DataType) => {
    setSelectedRow((prev) => (prev.some((r) => row.userId === r.userId) ? prev.filter((r) => r.userId !== row.userId) : [...prev, row]));
  };
  // Danh sách ngày trong tháng chọn
  const days = useMemo(() => {
    const daysInMonth = selectedMonth.daysInMonth();
    return Array.from({ length: daysInMonth }).map((_, index) => index + 1);
  }, [selectedMonth]);
  // Search
  const searchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };
  const handleSearch = (value: string) => {
    setSelectedRow([]);
    const searchTerm = value.trim().toLowerCase();

    const filteredUser = userTracker.filter((d) => d.displayName.toLowerCase().includes(searchTerm));
    if (filteredUser.length === 0) {
      openNotification(t("Notice"), t("No suitable employee found!"));
      return;
    }
    setData(filteredUser);
  };
  // Date picker
  const handleDateChange = (value: dayjs.Dayjs) => {
    setSearchInput("");
    setSelectedRow([]);
    setSelectedMonth(value);
  };

  return (
    <>
      {contextHolder}
      <Typography.Title level={3} className="flex justify-center font-semibold">
        {t("Attendance statistics")}
      </Typography.Title>
      <Filters
        type="attendance"
        loading={loading}
        selectedRow={selectedRow}
        searchInput={searchInput}
        selectedMonth={selectedMonth}
        searchChange={searchChange}
        handleSearch={handleSearch}
        handleDateChange={handleDateChange}
      />
      <AttendanceTable
        loading={loading}
        days={days}
        selectedMonth={selectedMonth}
        data={data}
        selectedRow={selectedRow}
        isSelectedAll={isSelectedAll}
        handleSelectAll={handleSelectAll}
        handleCheckboxChange={handleCheckboxChange}
      />
    </>
  );
}
