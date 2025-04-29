"use client";

import { dataSource } from "@/app/TestData/EmployeeList/data";
import { Button, Table } from "antd";
import Search from "antd/es/input/Search";

export default function EmployeeList() {
  const columns = [
    {
      title: "STT",
      key: "id",
      align: "center" as const,
      width: "5%",
      render: (_: unknown, __: unknown, index: number) => index + 1,
    },
    {
      title: "Mã NV",
      dataIndex: "employee_code",
      key: "employee_code",
      width: "10%",
      align: "center" as const,
    },
    {
      title: "Họ và tên",
      dataIndex: "employee_name",
      key: "employee_name",
      width: "20%",
      align: "center" as const,
    },
    {
      title: "Phòng ban",
      dataIndex: "employee_department",
      key: "employee_department",
      width: "15%",
      align: "center" as const,
    },
    {
      title: "Chức danh",
      dataIndex: "employee_role",
      key: "employee_role",
      width: "15%",
      align: "center" as const,
    },
    {
      title: "Hành động",
      width: "30%",
      align: "center" as const,
      render: () => (
        <div className="flex gap-x-2 justify-center">
          <Button type="primary">Chi tiết</Button>
          <Button type="primary">Chỉnh sửa</Button>
        </div>
      ),
    },
  ];
  return (
    <>
      <div className="flex justify-center text-2xl font-semibold my-3">Danh sách nhân viên</div>
      <div className="flex flex-col">
        <Search placeholder="Tìm kiếm nhân viên" style={{ width: "20%", marginBottom: 12 }} enterButton />
        <Table columns={columns} dataSource={dataSource} pagination={false} />
      </div>
    </>
  );
}
