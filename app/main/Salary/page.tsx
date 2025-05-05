"use client";

import { Table } from "antd";
import Search from "antd/es/input/Search";

export default function Salary() {
  const columns = [
    {
      title: "STT",
      key: "id",
      align: "center" as const,
      width: "5%",
      render: (_: unknown, __: unknown, index: number) => index + 1,
    },
    {
      title: "Nhân viên",
      dataIndex: "employee_name",
      key: "employee_name",
      width: "20%",
      align: "center" as const,
    },
    {
      title: "Kỳ lương",
      dataIndex: "salary_period",
      key: "salary_period",
      width: "15%",
      align: "center" as const,
    },
    {
      title: "Chế độ lương",
      dataIndex: "salary_scale",
      key: "salary_scale",
      width: "20%",
      align: "center" as const,
    },
    {
      title: "Chức danh",
      dataIndex: "employee_role",
      key: "employee_role",
      width: "20%",
      align: "center" as const,
    },
    {
      title: "Trạng thái",
      dataIndex: "salary_status",
      key: "salary_status",
      width: "20%",
      align: "center" as const,
    },
  ];
  return (
    <>
      <div className="flex justify-center text-2xl font-semibold my-3">Bảng lương nhân viên</div>
      <div className="flex flex-col">
        <Search placeholder="Tìm kiếm" style={{ width: "300px", marginBottom: 12 }} enterButton />
        <Table columns={columns} pagination={false} />
      </div>
    </>
  );
}
