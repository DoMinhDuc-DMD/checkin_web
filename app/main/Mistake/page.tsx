"use client";

import "@ant-design/v5-patch-for-react-19";
import { Spin, Typography } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useCustomNotification } from "@/app/hooks/UseCustomNotification";
import { MONTH_FORMAT, today } from "@/app/constant/ConstantVariables";
import dayjs from "dayjs";
import UseFetchData from "@/app/hooks/UseFetchData";
import MistakeTable from "@/app/component/Mistake/MistakeTable";
import { DataType } from "@/app/constant/DataType";
import Filters from "@/app/component/Filters";
import debounce from "lodash.debounce";

export default function Mistake() {
  // Lấy data
  const [selectedMonth, setSelectedMonth] = useState<dayjs.Dayjs>(today);
  const { userTracker, loading, t } = UseFetchData(selectedMonth);
  const [data, setData] = useState<DataType[]>([]);
  const { openNotification, contextHolder } = useCustomNotification();
  const [searchInput, setSearchInput] = useState("");
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
    setSelectedRow([]);
    setSearchInput("");
    setSelectedMonth(value);

    const filteredData = data.filter((d) =>
      d.trackRecord.some((track) => dayjs(track.date).format(MONTH_FORMAT) === value.format(MONTH_FORMAT))
    );
    setData(filteredData);
  };
  if (loading) {
    return (
      <div className="w-[100%] h-[100%] flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      {contextHolder}
      <Typography.Title level={3} className="flex justify-center font-semibold">
        {t("Attendance in late, out early statistic")}
      </Typography.Title>
      <Filters
        type="mistake"
        selectedRow={selectedRow}
        searchInput={searchInput}
        selectedMonth={selectedMonth}
        searchChange={searchChange}
        handleDateChange={handleDateChange}
      />
      <MistakeTable
        data={data}
        selectedMonth={selectedMonth}
        selectedRow={selectedRow}
        isSelectedAll={isSelectedAll}
        t={t}
        handleSelectAll={handleSelectAll}
        handleCheckboxChange={handleCheckboxChange}
      />
    </>
  );
}
