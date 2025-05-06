"use client";

import { dataSource } from "@/app/TestData/data";
import { notification } from "antd";
import Search from "antd/es/input/Search";
import { ChangeEvent, useState } from "react";
import "@ant-design/v5-patch-for-react-19";
import SalaryTable from "@/app/component/Salary/SalaryTable";

export default function Salary() {
  const [api, contextHolder] = notification.useNotification();
  const [data, setData] = useState(dataSource);
  const [searchInput, setSearchInput] = useState("");
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
      <div className="flex justify-center text-2xl font-semibold my-3">Bảng lương nhân viên</div>
      <div className="flex flex-col">
        <Search
          placeholder="Tìm kiếm"
          style={{ width: "300px", marginBottom: 12 }}
          value={searchInput}
          onChange={searchChange}
          onSearch={() => handleSearch(searchInput)}
          enterButton
        />
        <SalaryTable data={data} />
      </div>
    </>
  );
}
