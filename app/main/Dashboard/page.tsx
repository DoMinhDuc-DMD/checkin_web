"use client";

import { dataSource } from "@/app/TestData/data";
import Search from "antd/es/input/Search";
import { ChangeEvent, useState } from "react";
import dayjs from "dayjs";
import "@ant-design/v5-patch-for-react-19";
import DashboardTable from "@/app/component/Dashboard/DashboardTable";
import { notification } from "antd";

export default function Dashboard() {
  const [api, contextHolder] = notification.useNotification();
  const [data, setData] = useState(dataSource);
  const [searchInput, setSearchInput] = useState("");
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const daysInMonth = dayjs(new Date(currentYear, currentMonth)).daysInMonth();
  const days = Array.from({ length: daysInMonth }, (_, index) => index + 1);

  const workingDays = Array.from({ length: daysInMonth }, (_, index) => {
    const date = dayjs(new Date(currentYear, currentMonth - 1, index + 1));
    return date;
  }).filter((date) => {
    const dayOfWeek = date.day();
    return dayOfWeek !== 0 && dayOfWeek !== 6;
  });

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
      openNotification();
      return;
    }
    setData(filteredData);
  };

  const openNotification = () => {
    api.info({
      message: "Thông báo",
      description: "Không tìm thấy nhân viên phù hợp",
      placement: "topRight",
      duration: 2,
      style: {
        width: 400,
        borderRadius: 10,
      },
    });
  };

  return (
    <>
      {contextHolder}
      <div className="flex justify-center text-2xl font-semibold my-3">Thống kê chấm công</div>
      <div>
        <Search
          placeholder="Tìm kiếm nhân viên"
          style={{ width: "300px", marginBottom: 12 }}
          value={searchInput}
          onChange={searchChange}
          onSearch={() => handleSearch(searchInput)}
          enterButton
        />
        <DashboardTable days={days} currentMonth={currentMonth} currentYear={currentYear} dataSource={data} workingDays={workingDays} />
      </div>
    </>
  );
}
