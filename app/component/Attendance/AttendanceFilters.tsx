"use client";

import { DatePicker, Flex } from "antd";
import Search from "antd/es/input/Search";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

interface AttendanceFiltersProps {
  searchInput: string;
  selectedMonth: dayjs.Dayjs;
  searchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearch: (value: string) => void;
  handleDateChange: (value: dayjs.Dayjs | null) => void;
}

export default function AttendanceFilters({
  searchInput,
  selectedMonth,
  searchChange,
  handleSearch,
  handleDateChange,
}: AttendanceFiltersProps) {
  const { t } = useTranslation();
  return (
    <Flex justify="end" gap={20} style={{ marginBottom: 12 }}>
      <DatePicker picker="month" value={selectedMonth} onChange={handleDateChange} />
      <Search
        placeholder={t("Search employee")}
        style={{ width: 250 }}
        value={searchInput}
        onChange={searchChange}
        onSearch={() => handleSearch(searchInput)}
        enterButton
      />
    </Flex>
  );
}
