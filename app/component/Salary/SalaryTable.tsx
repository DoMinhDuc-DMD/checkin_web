"use client";

import { EmployeeTypeData } from "@/app/constant/DataType";
import { Table } from "antd";

interface SalaryTableProps {
  data: EmployeeTypeData[];
}

export default function SalaryTable({ data }: SalaryTableProps) {
  const columns = [
    {
      title: "STT",
      key: "id",
      align: "center" as const,
      width: 70,
      render: (_, __, index: number) => index + 1,
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
      width: 290,
      align: "center" as const,
    },
  ];
  return (
    <Table
      dataSource={data}
      columns={columns}
      size="small"
      scroll={{ y: "calc(100vh - 50px - 48px - 56px - 42px - 39px)" }}
      // full height - header - p/m - title - search - table header
      pagination={false}
    />
  );
}
