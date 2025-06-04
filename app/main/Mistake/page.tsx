"use client";

import "@ant-design/v5-patch-for-react-19";
import { Typography } from "antd";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useCustomNotification } from "@/app/hooks/UseCustomNotification";
import { MONTH_FORMAT, today } from "@/app/constant/ConstantVariables";
import dayjs from "dayjs";
import UseFetchData from "@/app/hooks/UseFetchData";
import MistakeTable from "@/app/component/Mistake/MistakeTable";
import { DataType } from "@/app/constant/DataType";
import Filters from "@/app/component/Filters";

export default function Mistake() {
  const { t } = useTranslation();
  // Lấy data
  const [selectedMonth, setSelectedMonth] = useState<dayjs.Dayjs>(today);
  const { userTracker, loading } = UseFetchData(selectedMonth);
  const [data, setData] = useState<DataType[]>([]);
  useEffect(() => {
    setData(userTracker);
  }, [userTracker]);
  // Search
  const { openNotification, contextHolder } = useCustomNotification();
  const [searchInput, setSearchInput] = useState("");
  // Checkbox
  const [selectedRow, setSelectedRow] = useState<DataType[]>([]);
  const isSelectedAll = selectedRow.length === data.length && data.length > 0;
  const handleSelectAll = () => {
    setSelectedRow(isSelectedAll ? [] : data);
  };
  const handleCheckboxChange = (row: DataType) => {
    setSelectedRow((prev) => (prev.some((r) => row.userId === r.userId) ? prev.filter((r) => r.userId !== row.userId) : [...prev, row]));
  };
  // Search
  const searchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };
  const handleSearch = (value: string) => {
    setSelectedRow([]);
    const searchTerm = value.trim().toLowerCase();
    setSearchInput(value);

    const filteredData = userTracker.filter((data) => data.displayName.toLowerCase().includes(searchTerm));
    if (filteredData.length === 0) {
      openNotification();
      return;
    }
    setData(filteredData);
  };
  // Datepicker
  const handleDateChange = (value: dayjs.Dayjs) => {
    setSelectedRow([]);
    setSearchInput("");
    setSelectedMonth(value);

    const filteredData = data.filter((d) =>
      d.trackRecord.some((track) => dayjs(track.date).format(MONTH_FORMAT) === value.format(MONTH_FORMAT))
    );
    setData(filteredData);
  };

  return (
    <>
      {contextHolder}
      <Typography.Title level={3} className="flex justify-center font-semibold">
        {t("Attendance in late, out early statistic")}
      </Typography.Title>
      <Filters
        type="mistake"
        loading={loading}
        selectedRow={selectedRow}
        searchInput={searchInput}
        selectedMonth={selectedMonth}
        searchChange={searchChange}
        handleSearch={handleSearch}
        handleDateChange={handleDateChange}
      />
      <MistakeTable
        loading={loading}
        data={data}
        selectedMonth={selectedMonth}
        selectedRow={selectedRow}
        isSelectedAll={isSelectedAll}
        handleSelectAll={handleSelectAll}
        handleCheckboxChange={handleCheckboxChange}
      />
    </>
  );
}
