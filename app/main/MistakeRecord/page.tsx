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
import MistakeRecordFilters from "@/app/component/MistakeRecord/MistakeRecordFilters";
import { MistakeRecordType } from "@/app/constant/DataType";
import MistakeRecordData from "@/app/component/MistakeRecord/MistakeRecordData";

export default function MistakeRecord() {
  const { t } = useTranslation();
  const { openNotification, contextHolder } = useCustomNotification();

  const [searchInput, setSearchInput] = useState("");
  const [selectedMonth, setSelectedMonth] = useState<dayjs.Dayjs | null>(today);
  // Lấy data
  const { user, userTracker } = UseFetchData(selectedMonth);
  // Lọc data
  const { originalMistakeRecord } = MistakeRecordData(user, userTracker);
  const [mistakeRecord, setMistakeRecord] = useState<MistakeRecordType[]>([]);

  useEffect(() => {
    setMistakeRecord(originalMistakeRecord);
  }, [originalMistakeRecord]);

  const searchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleSearch = (value: string) => {
    setSearchInput(value);
    let filteredData = originalMistakeRecord;

    if (value.trim() !== "") {
      const searchTerm = value.toLowerCase();
      filteredData = filteredData.filter((data) => data.displayName.toLowerCase().includes(searchTerm));
    }

    if (filteredData.length === 0) {
      openNotification(t("Notice"), t("No suitable employee found!"));
      return;
    }

    setMistakeRecord(filteredData);
  };

  const handleDateChange = (value: dayjs.Dayjs | null) => {
    setSearchInput("");
    let filteredData = originalMistakeRecord;

    if (!value) {
      setSelectedMonth(today);
      filteredData = filteredData.filter((data) =>
        data.trackRecord.some((track) => dayjs(track.date).format(MONTH_FORMAT) === today.format(MONTH_FORMAT))
      );
    } else {
      setSelectedMonth(value);
      filteredData = filteredData.filter((data) =>
        data.trackRecord.some((track) => dayjs(track.date).format(MONTH_FORMAT) === dayjs(value).format(MONTH_FORMAT))
      );
    }

    setMistakeRecord(filteredData);
  };

  return (
    <>
      {contextHolder}
      <Typography.Title level={3} className="flex justify-center font-semibold">
        {t("Attendance mistake statistic")}
      </Typography.Title>
      <MistakeRecordFilters
        searchInput={searchInput}
        selectedMonth={selectedMonth}
        searchChange={searchChange}
        handleSearch={handleSearch}
        handleDateChange={handleDateChange}
      />
      <MistakeRecordTable mistakeRecord={mistakeRecord} />
    </>
  );
}
