"use client";

import { EmployeeTypeData } from "@/app/constant/DataType";
import { Button, Table } from "antd";
import EmployeeListDetailModal from "./EmployeeListDetailModal";
import { useTranslation } from "react-i18next";
import { useState } from "react";

interface EmployeeListTableProps {
  data: EmployeeTypeData[];
}

export default function EmployeeListTable({ data }: EmployeeListTableProps) {
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<EmployeeTypeData | null>(null);

  const handleCancel = () => {
    setOpenModal(false);
  };
  const handleOk = () => {
    setOpenModal(false);
  };

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
      title: "Email",
      dataIndex: "employee_email",
      key: "employee_email",
      width: 200,
      align: "center" as const,
    },
    {
      title: t("Detail"),
      align: "center" as const,
      width: 390,
      render: (record) => (
        <div className="flex gap-x-2 justify-center">
          <Button
            type="primary"
            onClick={() => {
              setOpenModal(true);
              setSelectedRecord(record);
            }}
          >
            {t("Detail")}
          </Button>
        </div>
      ),
    },
  ];
  return (
    <>
      <EmployeeListDetailModal record={selectedRecord} openModal={openModal} onCancel={handleCancel} onOk={handleOk} />
      <Table
        columns={columns}
        dataSource={data}
        size="small"
        scroll={{ y: "calc(100vh - 50px - 48px - 56px - 42px - 39px)" }}
        // full height - header - p/m - title - search - table header
        pagination={false}
      />
    </>
  );
}
