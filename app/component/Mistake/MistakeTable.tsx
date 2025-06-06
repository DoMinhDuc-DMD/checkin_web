"use client";

import { DataType, TrackRecord } from "@/app/constant/DataType";
import { Button, Checkbox, Table } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import MistakeModal from "./MistakeModal";

interface MistakeTableProps {
  loading: boolean;
  data: DataType[];
  selectedMonth: dayjs.Dayjs;
  selectedRow: DataType[];
  isSelectedAll: boolean;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  handleSelectAll: () => void;
  handleCheckboxChange: (row: DataType) => void;
}

export default function MistakeTable({
  loading,
  data,
  selectedMonth,
  selectedRow,
  isSelectedAll,
  currentPage,
  setCurrentPage,
  handleSelectAll,
  handleCheckboxChange,
}: MistakeTableProps) {
  const { t } = useTranslation();
  // Open modal
  const [openModal, setOpenModal] = useState(false);
  const [selectedName, setSelectedName] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<TrackRecord>([]);
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
          {t("View")}
        </Button>
      ),
    },
  ];

  return (
    <>
      <MistakeModal
        selectedName={selectedName}
        selectedMonth={selectedMonth}
        selectedRecord={selectedRecord}
        openModal={openModal}
        onClose={onClose}
      />
      <Table
        loading={loading}
        dataSource={data}
        columns={columns}
        rowKey="userId"
        size="small"
        pagination={{
          current: currentPage,
          onChange: (page) => setCurrentPage(page),
          pageSize: 10,
          position: [`bottomCenter`],
          showSizeChanger: false,
          size: "default",
          hideOnSinglePage: true,
        }}
      />
    </>
  );
}
