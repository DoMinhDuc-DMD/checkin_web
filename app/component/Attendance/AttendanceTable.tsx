"use client";

import { CalculateWorkHour } from "@/app/utils/CalculateWorkHour";
import { Button, Checkbox, Flex, Table, Typography } from "antd";
import { DataType } from "@/app/constant/DataType";
import { useState } from "react";
import AttendanceModal from "./AttendanceModal";
import AttendanceDayColumns from "./AttendanceDayColumns";
import dayjs from "dayjs";

interface Props {
  days: number[];
  selectedMonth: dayjs.Dayjs;
  data: DataType[];
  selectedRow: DataType[];
  isSelectedAll: boolean;
  t: (key: string) => string;
  handleSelectAll: () => void;
  handleCheckboxChange: (row: DataType) => void;
}

export default function AttendanceTable({
  days,
  selectedMonth,
  data,
  selectedRow,
  isSelectedAll,
  t,
  handleSelectAll,
  handleCheckboxChange,
}: Props) {
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
      title: t("Staff name"),
      key: "displayName",
      width: 150,
      fixed: "left" as const,
      align: "center" as const,
      render: (record: DataType) => <span>{record.displayName}</span>,
    },
    {
      title: t("Total check"),
      fixed: "left" as const,
      align: "center" as const,
      sorter: (a: DataType, b: DataType) => {
        const aTimes = CalculateWorkHour(
          a.trackRecord.flatMap((r) => r.checkIn).filter((v): v is string => v !== null),
          a.trackRecord.flatMap((r) => r.checkOut).filter((v): v is string => v !== null)
        );
        const bTimes = CalculateWorkHour(
          b.trackRecord.flatMap((r) => r.checkIn).filter((v): v is string => v !== null),
          b.trackRecord.flatMap((r) => r.checkOut).filter((v): v is string => v !== null)
        );
        return aTimes.totalWorkingHour - bTimes.totalWorkingHour;
      },
      render: (record: DataType) => {
        const { totalWorkingHour, totalCheck } = CalculateWorkHour(
          record.trackRecord.flatMap((r) => r.checkIn).filter((v): v is string => v !== null),
          record.trackRecord.flatMap((r) => r.checkOut).filter((v): v is string => v !== null)
        );
        return (
          <Flex justify="space-between">
            <Typography.Text className="w-[100px]">
              {totalWorkingHour.toFixed(1)} {totalWorkingHour > 1 ? t("hours") : t("hour")}
            </Typography.Text>
            <Typography.Text className="w-[1px] text-center h-5 bg-black" />
            <Typography.Text className="w-[100px]">
              {totalCheck} {totalCheck > 1 ? t("days") : t("day")}
            </Typography.Text>
          </Flex>
        );
      },
    },
    ...AttendanceDayColumns(days, selectedMonth, t),
    {
      title: t("Detail"),
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
          t={t}
          openModal={openModal}
          onClose={() => setOpenModal(false)}
          selectedName={selectedName}
          record={selectedRecord}
          selectedMonth={selectedMonth}
          days={days}
        />
      )}
      <Table
        dataSource={data}
        columns={columns}
        rowKey={"userId"}
        size="small"
        scroll={{ x: "max-content" }}
        pagination={{ pageSize: 10, showSizeChanger: false, position: ["bottomCenter"], size: "default" }}
        locale={{
          triggerAsc: t("Sort ascending"),
          triggerDesc: t("Sort descending"),
          cancelSort: t("Cancel sorting"),
        }}
      />
    </>
  );
}
