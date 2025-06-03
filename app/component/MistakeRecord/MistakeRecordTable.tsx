"use client";

import { DataType, MistakeTrackRecord } from "@/app/constant/DataType";
import { Button, Checkbox, Table } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import MistakeRecordModal from "./MistakeRecordModal";

interface MistakeRecordProps {
  loading: boolean;
  data: DataType[];
  selectedRow: DataType[];
  isSelectedAll: boolean;
  handleSelectAll: () => void;
  handleCheckboxChange: (row: DataType) => void;
}

export default function MistakeRecordTable({
  loading,
  data,
  selectedRow,
  isSelectedAll,
  handleSelectAll,
  handleCheckboxChange,
}: MistakeRecordProps) {
  const { t } = useTranslation();
  // Open modal
  const [openModal, setOpenModal] = useState(false);
  const [selectedName, setSelectedName] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<MistakeTrackRecord>([]);
  const onClose = () => {
    setOpenModal(false);
  };

  const columns = [
    {
      title: <Checkbox checked={isSelectedAll} indeterminate={selectedRow.length > 0 && !isSelectedAll} onChange={handleSelectAll} />,
      key: "key",
      align: "center" as const,
      width: 50,
      render: (row: DataType) => {
        const isChecked = selectedRow.some((acc) => acc.userId === row.userId);
        return <Checkbox checked={isChecked} onChange={() => handleCheckboxChange(row)} />;
      },
    },
    {
      title: `${t("Name")}`,
      dataIndex: "displayName",
      key: "displayName",
      align: "center" as const,
      width: 160,
    },
    {
      title: `Email`,
      dataIndex: "email",
      key: "email",
      align: "center" as const,
      width: 160,
    },
    {
      title: `${t("Position")}`,
      dataIndex: "role",
      key: "role",
      align: "center" as const,
      width: 160,
    },
    {
      title: `${t("Total check in late")}`,
      key: "checkInLateCount",
      align: "center" as const,
      width: 160,
      render: (record: DataType) => (
        <span>
          {record.checkInLateCount} {record.checkInLateCount > 1 ? t("times") : t("time")}
        </span>
      ),
    },
    {
      title: `${t("Total check out early")}`,
      key: "checkOutEarlyCount",
      align: "center" as const,
      width: 160,
      render: (record: DataType) => (
        <span>
          {record.checkOutEarlyCount} {record.checkOutEarlyCount > 1 ? t("times") : t("time")}
        </span>
      ),
    },
    {
      title: `${t("Detail")}`,
      align: "center" as const,
      width: 200,
      render: (record: DataType) => (
        <Button
          style={{ width: 80 }}
          type="primary"
          onClick={() => {
            setSelectedName(record.displayName);
            setSelectedRecord(record.trackRecord);
            setOpenModal(true);
          }}
        >
          {t("Detail")}
        </Button>
      ),
    },
  ];

  return (
    <>
      <MistakeRecordModal selectedName={selectedName} selectedRecord={selectedRecord} openModal={openModal} onClose={onClose} />
      <Table
        loading={loading}
        dataSource={data}
        columns={columns}
        rowKey="userId"
        size="small"
        scroll={{ y: "calc(100vh - 200px)" }}
        pagination={false}
      />
    </>
  );
}
