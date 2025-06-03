"use client";

import { ConfigProvider, DatePicker, Flex, Input } from "antd";
import { useTranslation } from "react-i18next";
import { antdLocales } from "@/locales/antdLocales";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import "dayjs/locale/en";

interface FiltersProps {
  loading: boolean;
  searchInput: string;
  selectedMonth: dayjs.Dayjs;
  searchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearch: (value: string) => void;
  handleDateChange: (value: dayjs.Dayjs) => void;
}

export default function Filters({ loading, searchInput, selectedMonth, searchChange, handleSearch, handleDateChange }: FiltersProps) {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  dayjs.locale(currentLang);

  return (
    <Flex gap={20} style={{ marginBottom: 12 }}>
      <Input.Search
        placeholder={t("Search employee")}
        style={{ width: 250 }}
        value={searchInput}
        onChange={searchChange}
        onSearch={handleSearch}
        enterButton
        disabled={loading}
      />
      <ConfigProvider locale={antdLocales[currentLang]}>
        <DatePicker picker="month" value={selectedMonth} onChange={handleDateChange} disabled={loading} allowClear={false} />
      </ConfigProvider>
    </Flex>
  );
}
