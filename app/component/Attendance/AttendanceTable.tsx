"use client";

import { CalculateWorkHour } from "@/app/utils/CalculateWorkHour";
import { Button, Checkbox, Flex, Table, Typography } from "antd";
import { User, UserTrackerRecord } from "@/app/constant/DataType";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import AttendanceModal from "./AttendanceModal";
// import AttendanceExport from "./AttendanceExport";
import AttendanceDayColumns from "./AttendanceDayColumns";
import dayjs from "dayjs";

interface AttendanceTableProps {
  days: number[];
  selectedMonth: dayjs.Dayjs;
  user: User[];
  userTracker: UserTrackerRecord[];
}

export default function AttendanceTable({ days, selectedMonth, user, userTracker }: AttendanceTableProps) {
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<UserTrackerRecord | null>(null);

  const [selectedRow, setSelectedRow] = useState<UserTrackerRecord[]>([]);
  const isSelectedAll = selectedRow.length === userTracker.length && userTracker.length > 0;
  const handleSelectAll = () => {
    setSelectedRow(isSelectedAll ? [] : userTracker);
  };
  const handleCheckBoxChange = (row: UserTrackerRecord) => {
    setSelectedRow((prev) => (prev.some((r) => row.userId === r.userId) ? prev.filter((r) => r.userId !== row.userId) : [...prev, row]));
  };

  // Các cột trong bảng
  const columns = [
    {
      title: <Checkbox checked={isSelectedAll} indeterminate={selectedRow.length > 0 && !isSelectedAll} onChange={handleSelectAll} />,
      align: "center" as const,
      width: 50,
      fixed: "left" as const,
      render: (row: UserTrackerRecord) => {
        const isChecked = selectedRow.some((acc) => acc.userId === row.userId);
        return <Checkbox checked={isChecked} onChange={() => handleCheckBoxChange(row)} />;
      },
    },
    {
      title: t("Name"),
      key: "displayName",
      width: 150,
      fixed: "left" as const,
      align: "center" as const,
      render: (record: UserTrackerRecord) => {
        const userName = user.find((u) => u._id === record?.userId);
        return <span>{userName?.displayName || "---"}</span>;
      },
    },

    {
      title: t("Total check"),
      key: "total_check",
      width: 150,
      fixed: "left" as const,
      align: "center" as const,
      render: (_, record: UserTrackerRecord) => {
        const { totalWorkingHour, totalCheck } = CalculateWorkHour(
          record.records.flatMap((r) => r.checkIn).filter((v): v is string => v !== null),
          record.records.flatMap((r) => r.checkOut).filter((v): v is string => v !== null)
        );
        return (
          <Flex justify="space-between">
            <Typography.Text className="w-[80px]">
              {totalWorkingHour.toFixed(1)} {t("hours")}
            </Typography.Text>
            <Typography.Text className="w-[1px] h-5 bg-black" />
            <Typography.Text className="w-[60px]">
              {totalCheck} {t("days")}
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
      render: (record: UserTrackerRecord) => (
        <Button
          style={{ width: 80 }}
          type="primary"
          onClick={() => {
            setSelectedRecord(record);
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
      {/* {selectedRow.length > 0 && <AttendanceExport user={user} selectedRow={selectedRow} />} */}
      {selectedRecord && (
        <AttendanceModal
          openModal={openModal}
          onClose={() => setOpenModal(false)}
          user={user}
          record={selectedRecord}
          selectedMonth={selectedMonth}
          days={days}
        />
      )}
      <Table
        dataSource={userTracker}
        columns={columns}
        rowKey={"userId"}
        size="small"
        scroll={{ x: "max-content", y: "calc(48.8px * 12)" }}
        pagination={false}
      />
    </>
  );
}
