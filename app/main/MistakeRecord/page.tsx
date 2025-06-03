"use client";

import "@ant-design/v5-patch-for-react-19";
import { Typography } from "antd";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useCustomNotification } from "@/app/hooks/UseCustomNotification";
import { MONTH_FORMAT, today } from "@/app/constant/ConstantVariables";
import dayjs from "dayjs";
import UseFetchData from "@/app/hooks/UseFetchData";
import MistakeRecordTable from "@/app/component/MistakeRecord/MistakeRecordTable";
import { DataType } from "@/app/constant/DataType";
import Filters from "@/app/component/Filters";

export default function MistakeRecord() {
  const { t } = useTranslation();
  // Lấy data
  const [selectedMonth, setSelectedMonth] = useState<dayjs.Dayjs>(today);
  const { userTracker, loading } = UseFetchData(selectedMonth);
  const [data, setData] = useState<DataType[]>([]);
  useEffect(() => {
    setData(userTracker);
  }, [userTracker]);

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
    setSearchInput(value);
    let filteredData = data;
    if (value.trim() !== "") {
      filteredData = filteredData.filter((data) => data.displayName.toLowerCase().includes(value.toLowerCase()));
    }
    if (filteredData.length === 0) {
      openNotification(t("Notice"), t("No suitable employee found!"));
      return;
    }
    setData(filteredData);
  };

  // Datepicker
  const handleDateChange = (value: dayjs.Dayjs) => {
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
        loading={loading}
        searchInput={searchInput}
        selectedMonth={selectedMonth}
        searchChange={searchChange}
        handleSearch={handleSearch}
        handleDateChange={handleDateChange}
      />
      <MistakeRecordTable
        loading={loading}
        data={data}
        selectedRow={selectedRow}
        isSelectedAll={isSelectedAll}
        handleSelectAll={handleSelectAll}
        handleCheckboxChange={handleCheckboxChange}
      />
    </>
  );
}
