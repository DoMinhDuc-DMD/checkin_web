"use client";

import { EmployeeTypeData } from "@/app/constant/DataType";
import { Button, Table } from "antd";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import EmployeeWorkTimeDetailModal from "./EmployeeWorkTimeDetailModal";

interface EmployeeWorkTimeTableProps {
  data: EmployeeTypeData[];
}

export default function EmployeeWorkTimeTable({ data }: EmployeeWorkTimeTableProps) {
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
      width: 50,
      render: (_, __, index: number) => index + 1,
    },
    {
      title: t("Name"),
      dataIndex: "employee_name",
      key: "employee_name",
      width: 200,
      align: "center" as const,
    },
    {
      title: t("Department"),
      dataIndex: "employee_department",
      key: "employee_department",
      width: 200,
      align: "center" as const,
    },
    {
      title: t("Position"),
      dataIndex: "employee_position",
      key: "employee_position",
      width: 200,
      align: "center" as const,
    },
    {
      title: t("Worked hours"),
      dataIndex: "",
      key: "",
      width: 200,
      align: "center" as const,
    },
    {
      title: t("Overtime hours"),
      dataIndex: "",
      key: "",
      width: 200,
      align: "center" as const,
    },

    {
      title: t("Detail"),
      width: 200,
      align: "center" as const,
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
          <Button
            type="primary"
            onClick={() => {
              setOpenModal(true);
              setSelectedRecord(record);
            }}
          >
            {t("Delete")}
          </Button>
        </div>
      ),
    },
  ];
  return (
    <>
      <EmployeeWorkTimeDetailModal record={selectedRecord} openModal={openModal} onCancel={handleCancel} onOk={handleOk} />
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
