"use client";

import { DATE_FORMAT, SHOW_DAY_MONTH_FORMAT } from "@/app/constant/DateFormatting";
import { CalculateWorkHour } from "@/app/utils/CalculateWorkHour";
import { Button, Checkbox, Flex, Table, Tooltip, Typography } from "antd";
import { User } from "@/app/constant/DataType";
import { useState } from "react";
import dayjs from "dayjs";
import { CalculateWorkMinute } from "@/app/utils/CalculateWorkMinute";
import { useTranslation } from "react-i18next";
import AttendanceModal from "./AttendanceModal";
import { UserTrackerRecord } from "@/app/main/Attendance/page";
import AttendanceExport from "./AttendanceExport";

interface AttendanceTableProps {
  days: number[];
  currentYear: number;
  currentMonth: number;
  user: User[];
  userTracker: UserTrackerRecord[];
}

export default function AttendanceTable({ days, currentYear, currentMonth, user, userTracker }: AttendanceTableProps) {
  const { t } = useTranslation();

  const { Text } = Typography;
  const [selectedRow, setSelectedRow] = useState<UserTrackerRecord[]>([]);

  const [openModal, setOpenModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<UserTrackerRecord | null>(null);

  // Hiển thị các cột ngày
  const dayColumns = days.map((day) => {
    const date = dayjs(new Date(currentYear, currentMonth, day));
    const isWorkingDay = date.day() !== 0 && date.day() !== 6;

    return {
      title: date.format(SHOW_DAY_MONTH_FORMAT),
      key: `day_${day}`,
      width: 70,
      align: "center" as const,
      onCell: () => ({ style: { backgroundColor: isWorkingDay ? "" : "oklch(0.96 0 0)" } }),
      render: (_, record: UserTrackerRecord) => {
        if (!isWorkingDay) {
          return <span className="font-semibold">OFF</span>;
        }

        const dateStr = date.format("YYYY-MM-DD");
        const foundDate = record.records.find((r) => r.dateStr === dateStr);

        if (!foundDate) {
          return <span className="font-semibold">---</span>;
        }

        const minutes = CalculateWorkMinute(foundDate.checkIn, foundDate.checkOut);
        const workedHours = (minutes / 60).toFixed(2);

        return (
          <Tooltip title={`${foundDate.checkIn.split(", ")[1]} - ${foundDate.checkOut.split(", ")[1]}`}>
            <span className={`font-semibold ${Number(workedHours) >= 8 ? "text-green-600" : "text-red-500"}`}>{workedHours}</span>
          </Tooltip>
        );
      },
    };
  });

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
      width: 200,
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
      width: 200,
      fixed: "left" as const,
      align: "center" as const,
      render: (_, record: UserTrackerRecord) => {
        const { totalHour, totalCheck } = CalculateWorkHour(
          record.records.flatMap((r) => r.checkIn).filter((v): v is string => v !== null),
          record.records.flatMap((r) => r.checkOut).filter((v): v is string => v !== null)
        );
        return (
          <Flex justify="space-between">
            <Text className="w-[80px]">
              {totalHour.toFixed(1)} {t("hours")}
            </Text>
            <Text className="w-[1px] h-5 bg-black" />
            <Text className="w-[60px]">
              {totalCheck} {t("days")}
            </Text>
          </Flex>
        );
      },
    },
    ...dayColumns,
    {
      title: t("Detail"),
      key: "detail",
      fixed: "right" as const,
      align: "center" as const,
      width: 100,
      render: (record: UserTrackerRecord) => (
        <Button
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
      {selectedRow.length > 0 && <AttendanceExport user={user} selectedRow={selectedRow} />}
      {selectedRecord && (
        <AttendanceModal
          openModal={openModal}
          onClose={() => setOpenModal(false)}
          user={user}
          record={selectedRecord}
          currentYear={currentYear}
          currentMonth={currentMonth}
          days={days}
        />
      )}
      <Table
        dataSource={userTracker}
        columns={columns}
        rowKey={"userId"}
        size="small"
        scroll={{ x: "max-content", y: "calc(100vh - 50px - 48px - 56px - 42px - 39px)" }}
        // full height - header - p/m - title - search - table header
        pagination={false}
      />
    </>
  );
}
