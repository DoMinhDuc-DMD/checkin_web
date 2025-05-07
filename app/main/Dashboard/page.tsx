"use client";

import { dataSource } from "@/app/TestData/data";
import Search from "antd/es/input/Search";
import { ChangeEvent, useState } from "react";
import dayjs from "dayjs";
import "@ant-design/v5-patch-for-react-19";
import DashboardTable from "@/app/component/Dashboard/DashboardTable";
import { notification, Typography } from "antd";

export default function Dashboard() {
  const [api, contextHolder] = notification.useNotification();
  const [data, setData] = useState(dataSource);
  const [searchInput, setSearchInput] = useState("");

  const { Title } = Typography;

  const today = dayjs();
  const currentMonth = today.month();
  const currentYear = today.year();
  const daysInMonth = today.daysInMonth();

  const days = Array.from({ length: daysInMonth }, (_, index) => index + 1);

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
      <Title level={3} className="flex justify-center font-semibold my-3">
        Thống kê chấm công
      </Title>
      <Search
        placeholder="Tìm kiếm nhân viên"
        style={{ width: "300px", marginBottom: 12 }}
        value={searchInput}
        onChange={searchChange}
        onSearch={() => handleSearch(searchInput)}
        enterButton
      />
      <DashboardTable days={days} currentMonth={currentMonth} currentYear={currentYear} dataSource={data} />
    </>
  );
}
