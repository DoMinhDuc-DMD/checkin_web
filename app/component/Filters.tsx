"use client";

import { ConfigProvider, DatePicker, Flex, Input } from "antd";
import { useTranslation } from "react-i18next";
import { antdLocales } from "@/locales/antdLocales";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import "dayjs/locale/en";
import { DataType } from "../constant/DataType";
import ExportData from "./ExportData";

interface FiltersProps {
  type: string;
  selectedRow: DataType[];
  searchInput: string;
  selectedMonth: dayjs.Dayjs;
  searchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDateChange: (value: dayjs.Dayjs) => void;
}

export default function Filters({ type, selectedRow, searchInput, selectedMonth, searchChange, handleDateChange }: FiltersProps) {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  dayjs.locale(currentLang);

  return (
    <Flex gap={20} style={{ marginBottom: 12 }}>
      <Input placeholder={t("Search staff")} style={{ width: 200 }} value={searchInput} onChange={searchChange} />
      <ConfigProvider locale={antdLocales[currentLang]}>
        <DatePicker picker="month" value={selectedMonth} onChange={handleDateChange} allowClear={false} />
      </ConfigProvider>
      <ExportData selectedRow={selectedRow} type={type} t={t} />
    </Flex>
  );
}
