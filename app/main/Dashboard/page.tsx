"use client";

import { dataCheckIn } from "@/app/TestData/Dashboard/data";
import { Table } from "antd";
import Search from "antd/es/input/Search";
import { ChangeEvent, useState } from "react";
import dayjs from "dayjs";
import "@ant-design/v5-patch-for-react-19";

export default function Dashboard() {
  const [dataCheck, setDataCheck] = useState(dataCheckIn);
  const [searchInput, setSearchInput] = useState("");
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, index) => index + 1);

  const dayColumns = days.map((day, index) => ({
    title: dayjs(`${currentYear}-${currentMonth}-${day}`).format("DD/MM"),
    key: `day_${day}`,
    width: 70,
    align: "center" as const,
    render: (_: any, record: any) => {
      const value = record.employee_check[index];
      return <span className={`font-semibold ${value > 0 ? "text-green-600" : "text-red-600"}`}>{value}</span>;
    },
  }));

  const columns = [
    {
      title: "STT",
      key: "id",
      align: "center" as const,
      width: 60,
      fixed: "left" as const,
      render: (_: unknown, __: unknown, index: number) => index + 1,
    },
    {
      title: "Mã NV",
      dataIndex: "employee_code",
      key: "employee_code",
      width: 100,
      fixed: "left" as const,
      align: "center" as const,
    },
    {
      title: "Họ và tên",
      dataIndex: "employee_name",
      key: "employee_name",
      width: 150,
      fixed: "left" as const,
      align: "center" as const,
    },
    {
      title: "Tổng công",
      key: "total_check",
      width: 150,
      fixed: "left" as const,
      align: "center" as const,
      render: (_: any, record: any) => {
        const totalHour = record.employee_check.reduce((sum: number, val: number) => sum + val, 0);
        const totalCheck = record.employee_check.filter((check: number) => check > 0).length;
        return (
          <div className="flex justify-between">
            <div>{totalHour} giờ</div>
            <div className="w-[1px] bg-black"></div>
            <div>{totalCheck} ngày</div>
          </div>
        );
      },
    },
    ...dayColumns,
  ];

  const searchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleSearch = (value: string) => {
    if (!value) {
      setDataCheck(dataCheckIn);
    } else {
      setSearchInput(value);
      const searchTerm = value.toLowerCase();
      const filteredData = dataCheckIn.filter((data) => data.employee_name.toLowerCase().includes(searchTerm));
      setDataCheck(filteredData);
    }
  };

  return (
    <>
      <div className="flex justify-center text-2xl font-semibold my-3">Thống kê chấm công</div>
      <div>
        <Search
          placeholder="Tìm kiếm"
          style={{ width: "20%", marginBottom: 12 }}
          value={searchInput}
          onChange={searchChange}
          onSearch={() => handleSearch(searchInput)}
          enterButton
        />
        <Table dataSource={dataCheck} columns={columns} scroll={{ x: "max-content", y: 55 * 9 }} pagination={false} />
      </div>
    </>
  );
}
