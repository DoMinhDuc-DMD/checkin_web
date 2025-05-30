"use client";

import { MistakeRecordType, MistakeTrackRecord } from "@/app/constant/DataType";
import { Button, Checkbox, Table } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import MistakeRecordModal from "./MistakeRecordModal";

interface MistakeRecordProps {
  mistakeRecord: MistakeRecordType[];
}

export default function MistakeRecordTable({ mistakeRecord }: MistakeRecordProps) {
  const { t } = useTranslation();
  // Select row
  const [selectedRow, setSelectedRow] = useState<MistakeRecordType[]>([]);
  const isSelectedAll = selectedRow.length === mistakeRecord.length && mistakeRecord.length > 0;
  const handleSelectAll = () => {
    setSelectedRow(isSelectedAll ? [] : mistakeRecord);
  };
  const handleCheckBoxChange = (row: MistakeRecordType) => {
    setSelectedRow((prev) => (prev.some((r) => row.userId === r.userId) ? prev.filter((r) => r.userId !== row.userId) : [...prev, row]));
  };
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
      render: (row: MistakeRecordType) => {
        const isChecked = selectedRow.some((acc) => acc.userId === row.userId);
        return <Checkbox checked={isChecked} onChange={() => handleCheckBoxChange(row)} />;
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
      render: (record: MistakeRecordType) => (
        <span>
          {record.checkInLateCount} {t("times")}
        </span>
      ),
    },
    {
      title: `${t("Total check out early")}`,
      key: "checkOutEarlyCount",
      align: "center" as const,
      width: 160,
      render: (record: MistakeRecordType) => (
        <span>
          {record.checkOutEarlyCount} {t("times")}
        </span>
      ),
    },
    {
      title: `${t("Detail")}`,
      align: "center" as const,
      width: 200,
      render: (record: MistakeRecordType) => (
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
        dataSource={mistakeRecord}
        columns={columns}
        rowKey="userId"
        size="small"
        scroll={{ y: "calc(48.8px * 12)" }}
        pagination={false}
      />
    </>
  );
}
