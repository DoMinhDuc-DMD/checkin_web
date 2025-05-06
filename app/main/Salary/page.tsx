"use client";

import { dataSource } from "@/app/TestData/data";
import { notification, Table } from "antd";
import Search from "antd/es/input/Search";
import { ChangeEvent, useState } from "react";
import "@ant-design/v5-patch-for-react-19";

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

  const columns = [
    {
      title: "STT",
      key: "id",
      align: "center" as const,
      width: 70,
      render: (_: unknown, __: unknown, index: number) => index + 1,
    },
    {
      title: "Mã nhân viên",
      dataIndex: "employee_code",
      key: "employee_code",
      width: 120,
      align: "center" as const,
    },
    {
      title: "Họ tên nhân viên",
      dataIndex: "employee_name",
      key: "employee_name",
      width: 180,
      align: "center" as const,
    },
    {
      title: "Phòng ban",
      dataIndex: "employee_department",
      key: "employee_department",
      width: 150,
      align: "center" as const,
    },
    {
      title: "Chức danh",
      dataIndex: "employee_position",
      key: "employee_position",
      width: 150,
      align: "center" as const,
    },
    {
      title: "Kỳ lương",
      dataIndex: "salary_period",
      key: "salary_period",
      width: 150,
      align: "center" as const,
    },
    {
      title: "Chế độ lương",
      dataIndex: "salary_scale",
      key: "salary_scale",
      width: 150,
      align: "center" as const,
    },
    {
      title: "Trạng thái",
      dataIndex: "salary_status",
      key: "salary_status",
      align: "center" as const,
    },
  ];
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
        <Table dataSource={data} columns={columns} size="small" scroll={{ y: 550 }} pagination={false} />
      </div>
    </>
  );
}
