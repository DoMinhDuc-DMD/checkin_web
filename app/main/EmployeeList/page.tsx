"use client";

import { dataSource } from "@/app/TestData/data";
import { Button, notification, Table } from "antd";
import Search from "antd/es/input/Search";
import { ChangeEvent, useState } from "react";
import "@ant-design/v5-patch-for-react-19";

export default function EmployeeList() {
  const [data, setData] = useState(dataSource);
  const [searchInput, setSearchInput] = useState("");
  const [api, contextHolder] = notification.useNotification();
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
      title: "Email công ty",
      dataIndex: "employee_email",
      key: "employee_email",
      width: 200,
      align: "center" as const,
    },
    {
      title: "Hành động",
      align: "center" as const,
      render: () => (
        <div className="flex gap-x-2 justify-center">
          <Button type="primary">Chi tiết</Button>
          <Button type="primary">Chỉnh sửa</Button>
        </div>
      ),
    },
  ];

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
      <div className="flex justify-center text-2xl font-semibold my-3">Danh sách nhân viên</div>
      <div className="flex flex-col">
        <Search
          placeholder="Tìm kiếm nhân viên"
          style={{ width: "300px", marginBottom: 12 }}
          value={searchInput}
          onChange={searchChange}
          onSearch={() => handleSearch(searchInput)}
          enterButton
        />
        <Table columns={columns} dataSource={data} size="small" scroll={{ y: 550 }} pagination={false} />
      </div>
    </>
  );
}
