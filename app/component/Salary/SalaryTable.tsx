"use client";

import { EmployeeTypeData } from "@/app/constant/DataType";
import { Table } from "antd";
import { useTranslation } from "react-i18next";

interface SalaryTableProps {
  data: EmployeeTypeData[];
}

export default function SalaryTable({ data }: SalaryTableProps) {
  const { t } = useTranslation();
  const columns = [
    {
      title: t("ID"),
      key: "id",
      align: "center" as const,
      width: 70,
      render: (_, __, index: number) => index + 1,
    },
    {
      title: t("Code"),
      dataIndex: "employee_code",
      key: "employee_code",
      width: 120,
      align: "center" as const,
    },
    {
      title: t("Name"),
      dataIndex: "employee_name",
      key: "employee_name",
      width: 180,
      align: "center" as const,
    },
    {
      title: t("Department"),
      dataIndex: "employee_department",
      key: "employee_department",
      width: 150,
      align: "center" as const,
    },
    {
      title: t("Position"),
      dataIndex: "employee_position",
      key: "employee_position",
      width: 150,
      align: "center" as const,
    },
    {
      title: t("Pay period"),
      dataIndex: "salary_period",
      key: "salary_period",
      width: 150,
      align: "center" as const,
    },
    {
      title: t("Salary type"),
      dataIndex: "salary_scale",
      key: "salary_scale",
      width: 150,
      align: "center" as const,
    },
    {
      title: t("Status"),
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
