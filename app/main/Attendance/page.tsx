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
import debounce from "lodash.debounce";

export default function Attendance() {
  const { t } = useTranslation();
  // Lấy data
  const [selectedMonth, setSelectedMonth] = useState<dayjs.Dayjs>(today);
  const { userTracker, loading } = UseFetchData(selectedMonth);
  const [data, setData] = useState<DataType[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const { openNotification, contextHolder } = useCustomNotification();
  useEffect(() => {
    setData(userTracker);
  }, [userTracker]);

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

  // Tìm kiếm
  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSelectedRow([]);
        const filteredUser = userTracker.filter((d) => d.displayName.toLowerCase().includes(value.trim().toLowerCase()));
        if (filteredUser.length === 0) {
          openNotification();
          return;
        }
        setData(filteredUser);
      }, 300),
    [userTracker]
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const searchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    debouncedSearch(value);
  };

  // Chọn ngày
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
