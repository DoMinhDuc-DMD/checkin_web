"use client";

import { DATE_FORMAT, SHOW_DAY_MONTH_FORMAT } from "@/app/constant/DateFormatting";
import { CalculateWorkHour } from "@/app/utils/CalculateWorkHour";
import { Button, Checkbox, Flex, Table, Tooltip, Typography } from "antd";
import { CSVLink } from "react-csv";
import DashboardModal from "./DashboardModal";
import { EmployeeTypeData } from "@/app/constant/DataType";
import { useState } from "react";
import dayjs from "dayjs";
import { CalculateWorkMinute } from "@/app/utils/CalculateWorkMinute";
import { useTranslation } from "react-i18next";

interface DashboardTableProps {
  days: number[];
  currentYear: number;
  currentMonth: number;
  dataSource: EmployeeTypeData[];
}

export default function DashboardTable({ days, currentYear, currentMonth, dataSource }: DashboardTableProps) {
  const { t } = useTranslation();

  const { Text } = Typography;
  const [selectedRow, setSelectedRow] = useState<EmployeeTypeData[]>([]);

  const [openModal, setOpenModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<EmployeeTypeData | null>(null);

  // Hiển thị các cột ngày
  const dayColumns = days.map((day) => {
    const date = dayjs(new Date(currentYear, currentMonth, day));
    const dateStr = date.format(DATE_FORMAT);
    const isWorkingDay = date.day() !== 0 && date.day() !== 6;

    return {
      title: date.format(SHOW_DAY_MONTH_FORMAT),
      key: `day_${day}`,
      width: 70,
      align: "center" as const,
      onCell: () => ({ style: { backgroundColor: isWorkingDay ? "" : "oklch(0.96 0 0)" } }),
      render: (_, record) => {
        if (!isWorkingDay) {
          return <span className="font-semibold">OFF</span>;
        } else {
          const checkInIndex = record.employee_check_in.findIndex((check: string) => check.startsWith(dateStr));
          const checkOutIndex = record.employee_check_out.findIndex((check: string) => check.startsWith(dateStr));

          const checkIn = record.employee_check_in[checkInIndex];
          const checkOut = record.employee_check_out[checkOutIndex];

          if (checkIn && checkOut) {
            const minutes = CalculateWorkMinute(checkIn, checkOut);
            const workedHours = (minutes / 60).toFixed(1);
            return (
              <Tooltip title={`${checkIn.split(", ")[1]} - ${checkOut.split(", ")[1]}`}>
                <span className={`font-semibold ${Number(workedHours) >= 8 ? "text-green-600" : "text-red-500"}`}>{workedHours}</span>
              </Tooltip>
            );
          }
        }
        return <span className="font-semibold">---</span>;
      },
    };
  });

  const isSelectedAll = selectedRow.length === dataSource.length && dataSource.length > 0;

  const handleSelectAll = () => {
    setSelectedRow(isSelectedAll ? [] : dataSource);
  };

  const handleCheckBoxChange = (row: EmployeeTypeData) => {
    setSelectedRow((prev) => (prev.some((r) => row.key === r.key) ? prev.filter((r) => r.key !== row.key) : [...prev, row]));
  };

  // Các cột trong bảng
  const columns = [
    {
      title: <Checkbox checked={isSelectedAll} indeterminate={selectedRow.length > 0 && !isSelectedAll} onChange={handleSelectAll} />,
      align: "center" as const,
      width: 70,
      fixed: "left" as const,
      render: (row: EmployeeTypeData) => {
        const isChecked = selectedRow.some((acc) => acc.key === row.key);
        return <Checkbox checked={isChecked} onChange={() => handleCheckBoxChange(row)} />;
      },
    },
    {
      title: t("Code"),
      dataIndex: "employee_code",
      key: "employee_code",
      width: 120,
      fixed: "left" as const,
      align: "center" as const,
    },
    {
      title: t("Name"),
      dataIndex: "employee_name",
      key: "employee_name",
      width: 180,
      fixed: "left" as const,
      align: "center" as const,
    },
    {
      title: t("Total check"),
      key: "total_check",
      width: 160,
      fixed: "left" as const,
      align: "center" as const,
      render: (_, record) => {
        const { totalHour, totalCheck } = CalculateWorkHour(record.employee_check_in, record.employee_check_out);
        return (
          <Flex justify="space-between">
            <Text className="w-[70px]">
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
      render: (record: EmployeeTypeData) => (
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

  // Xử lý dữ liệu in CSV
  const csvData = selectedRow.flatMap((row) => {
    const { totalHour, totalCheck } = CalculateWorkHour(row.employee_check_in, row.employee_check_out);

    const checkInMap = row.employee_check_in.reduce((map, ci) => {
      const [date, time] = ci.split(", ");
      map[date] = time;
      return map;
    }, {} as Record<string, string>);

    const checkOutMap = row.employee_check_out.reduce((map, co) => {
      const [date, time] = co.split(", ");
      map[date] = time;
      return map;
    }, {} as Record<string, string>);

    const allDates = Array.from(new Set([...Object.keys(checkInMap), ...Object.keys(checkOutMap)]));

    return allDates.map((date) => ({
      employee_code: row.employee_code,
      employee_name: row.employee_name,
      employee_department: row.employee_department,
      employee_position: row.employee_position,
      employee_email: row.employee_email,
      date,
      check_in: checkInMap[date] || "N/A",
      check_out: checkOutMap[date] || "N/A",
      totalHour,
      totalCheck,
    }));
  });

  return (
    <>
      {selectedRow.length > 0 && (
        <CSVLink className="ml-5" data={csvData} filename="employee_statistic">
          <Button type="primary">{t("Export CSV")}</Button>
        </CSVLink>
      )}
      {selectedRecord && (
        <DashboardModal
          openModal={openModal}
          onClose={() => setOpenModal(false)}
          record={selectedRecord}
          currentYear={currentYear}
          currentMonth={currentMonth}
          days={days}
        />
      )}
      <Table
        dataSource={dataSource}
        columns={columns}
        size="small"
        scroll={{ x: "max-content", y: "calc(100vh - 50px - 48px - 56px - 42px - 39px)" }}
        // full height - header - p/m - title - search - table header
        pagination={false}
      />
    </>
  );
}
