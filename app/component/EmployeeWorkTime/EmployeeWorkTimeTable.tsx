"use client";

import { User } from "@/app/constant/DataType";
import { Button, Table } from "antd";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import EmployeeWorkTimeDetailModal from "./EmployeeWorkTimeDetailModal";

interface EmployeeWorkTimeTableProps {
  user: User[];
}

export default function EmployeeWorkTimeTable({ user }: EmployeeWorkTimeTableProps) {
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<User | null>(null);

  const handleCancel = () => {
    setOpenModal(false);
  };
  const handleOk = () => {
    setOpenModal(false);
  };

  const columns = [
    {
      title: t("ID"),
      key: "_id",
      align: "center" as const,
      width: 50,
      render: (_, __, index: number) => index + 1,
    },
    {
      title: t("Name"),
      dataIndex: "displayName",
      key: "displayName",
      width: 200,
      align: "center" as const,
    },
    {
      title: t("Position"),
      dataIndex: "role",
      key: "role",
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
        </div>
      ),
    },
  ];
  return (
    <>
      <EmployeeWorkTimeDetailModal record={selectedRecord} openModal={openModal} onCancel={handleCancel} onOk={handleOk} />
      <Table
        columns={columns}
        dataSource={user}
        rowKey={"_id"}
        size="small"
        scroll={{ y: "calc(100vh - 50px - 48px - 56px - 42px - 39px)" }}
        // full height - header - p/m - title - search - table header
        pagination={false}
      />
    </>
  );
}
