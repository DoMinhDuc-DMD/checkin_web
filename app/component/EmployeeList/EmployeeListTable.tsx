"use client";

import { EmployeeTypeData } from "@/app/constant/DataType";
import { Button, Table } from "antd";
import EmployeeListDetailModal from "./EmployeeListDetailModal";

interface EmployeeListTableProps {
  data: EmployeeTypeData[];
}

export default function EmployeeListTable({ data }: EmployeeListTableProps) {
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
      title: "Email công ty",
      dataIndex: "employee_email",
      key: "employee_email",
      width: 200,
      align: "center" as const,
    },
    {
      title: "Chi tiết",
      align: "center" as const,
      width: 390,
      render: (record) => (
        <div className="flex gap-x-2 justify-center">
          <Button type="primary" onClick={() => EmployeeListDetailModal(record)}>
            Chi tiết
          </Button>
        </div>
      ),
    },
  ];
  return (
    <Table
      columns={columns}
      dataSource={data}
      size="small"
      scroll={{ y: "calc(100vh - 50px - 48px - 56px - 42px - 39px)" }}
      // full height - header - p/m - title - search - table header
      pagination={false}
    />
  );
}
