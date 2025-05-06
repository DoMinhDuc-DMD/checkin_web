"use client";

import { EmployeeTypeData } from "@/app/constant/DataType";
import { Button, Table } from "antd";
import EmployeeListModal from "./EmployeeListModal";

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
      title: "Chi tiết",
      align: "center" as const,
      render: (record) => (
        <div className="flex gap-x-2 justify-center">
          <Button type="primary" onClick={() => EmployeeListModal(record)}>
            Chi tiết
          </Button>
        </div>
      ),
    },
  ];
  return <Table columns={columns} dataSource={data} size="small" scroll={{ y: 550 }} pagination={false} />;
}
