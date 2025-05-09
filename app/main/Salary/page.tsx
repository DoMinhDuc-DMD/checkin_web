"use client";

import { dataSource } from "@/app/TestData/data";
import { Typography } from "antd";
import Search from "antd/es/input/Search";
import { ChangeEvent, useState } from "react";
import "@ant-design/v5-patch-for-react-19";
import SalaryTable from "@/app/component/Salary/SalaryTable";
import { useCustomNotification } from "@/app/hooks/UseCustomNotification";
import { useTranslation } from "react-i18next";

export default function Salary() {
  const { t } = useTranslation();
  const [data, setData] = useState(dataSource);
  const [searchInput, setSearchInput] = useState("");
  const { openNotification, contextHolder } = useCustomNotification();
  const { Title } = Typography;

  const searchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleSearch = (value: string) => {
    setSearchInput(value);
    if (!value) {
      setData(dataSource);
      return;
    }
    const searchTerm = value.toLowerCase();
    const filteredData = dataSource.filter((data) => data.employee_name.toLowerCase().includes(searchTerm));
    if (filteredData.length === 0) {
      openNotification(t("Notice"), t("No suitable employee found!"));
      return;
    }
    setData(filteredData);
  };

  return (
    <>
      {contextHolder}
      <Title level={3} className="flex justify-center font-semibold my-3">
        {t("Employee salary table")}
      </Title>
      <Search
        placeholder={t("Search employee")}
        style={{ width: "300px", marginBottom: 12 }}
        value={searchInput}
        onChange={searchChange}
        onSearch={() => handleSearch(searchInput)}
        enterButton
      />
      <SalaryTable data={data} />
    </>
  );
}
