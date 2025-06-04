"use client";

import { CalculateWorkHour } from "@/app/utils/CalculateWorkHour";
import { Button, Checkbox, Flex, Table, Typography } from "antd";
import { DataType } from "@/app/constant/DataType";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import AttendanceModal from "./AttendanceModal";
import AttendanceDayColumns from "./AttendanceDayColumns";
import dayjs from "dayjs";

interface AttendanceTableProps {
  loading: boolean;
  days: number[];
  selectedMonth: dayjs.Dayjs;
  data: DataType[];
  selectedRow: DataType[];
  isSelectedAll: boolean;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  handleSelectAll: () => void;
  handleCheckboxChange: (row: DataType) => void;
}

export default function AttendanceTable({
  loading,
  days,
  selectedMonth,
  data,
  selectedRow,
  isSelectedAll,
  currentPage,
  setCurrentPage,
  handleSelectAll,
  handleCheckboxChange,
}: AttendanceTableProps) {
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(false);
  const [selectedName, setSelectedName] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<DataType>();

  const columns = [
    {
      title: <Checkbox checked={isSelectedAll} indeterminate={selectedRow.length > 0 && !isSelectedAll} onChange={handleSelectAll} />,
      align: "center" as const,
      width: 50,
      fixed: "left" as const,
      render: (row: DataType) => {
        const isChecked = selectedRow.some((r) => r.userId === row.userId);
        return <Checkbox checked={isChecked} onChange={() => handleCheckboxChange(row)} />;
      },
    },
    {
      title: t("Name"),
      key: "displayName",
      width: 150,
      fixed: "left" as const,
      align: "center" as const,
      render: (record: DataType) => <span>{record.displayName || "---"}</span>,
    },
    {
      title: t("Total check"),
      key: "total_check",
      fixed: "left" as const,
      align: "center" as const,
      render: (_, record: DataType) => {
        const { totalWorkingHour, totalCheck } = CalculateWorkHour(
          record.trackRecord.flatMap((r) => r.checkIn).filter((v): v is string => v !== null),
          record.trackRecord.flatMap((r) => r.checkOut).filter((v): v is string => v !== null)
        );
        return (
          <Flex justify="space-between">
            <Typography.Text className="w-[90px]">
              {totalWorkingHour.toFixed(2)} {totalWorkingHour > 1 ? t("hours") : t("hour")}
            </Typography.Text>
            <Typography.Text className="w-[1px] text-center h-5 bg-black" />
            <Typography.Text className="w-[60px]">
              {totalCheck} {totalCheck > 1 ? t("days") : t("day")}
            </Typography.Text>
          </Flex>
        );
      },
    },
    ...AttendanceDayColumns(days, selectedMonth),
    {
      title: t("Detail"),
      key: "detail",
      fixed: "right" as const,
      align: "center" as const,
      width: 100,
      render: (record: DataType) => (
        <Button
          style={{ width: 80 }}
          type="primary"
          onClick={() => {
            setSelectedName(record.displayName);
            setSelectedRecord(record);
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
      {selectedRecord && (
        <AttendanceModal
          openModal={openModal}
          onClose={() => setOpenModal(false)}
          selectedName={selectedName}
          record={selectedRecord}
          selectedMonth={selectedMonth}
          days={days}
        />
      )}
      <Table
        loading={loading}
        dataSource={data}
        columns={columns}
        rowKey={"userId"}
        size="small"
        scroll={{ x: "max-content" }}
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
