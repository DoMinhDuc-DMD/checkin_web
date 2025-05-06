"use client";

import { DATE_FORMAT, DATE_HOUR_FORMAT, SHOW_DAY_MONTH_FORMAT } from "@/app/constant/DateFormatting";
import { calculateWorkTime } from "@/app/utils/calculateWorkTime";
import { Button, Checkbox, Table } from "antd";
import dayjs from "dayjs";
import { CSVLink } from "react-csv";
import DashboardModal from "./DashboardModal";
import { EmployeeTypeData } from "@/app/constant/DataType";
import { useState } from "react";

interface DashboardTableProps {
  days: number[];
  currentYear: number;
  currentMonth: number;
  dataSource: EmployeeTypeData[];
}

export default function DashboardTable({ days, currentYear, currentMonth, dataSource }: DashboardTableProps) {
  const [selectedRow, setSelectedRow] = useState<EmployeeTypeData[]>([]);

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
            const checkInTime = dayjs(checkIn, DATE_HOUR_FORMAT);
            const checkOutTime = dayjs(checkOut, DATE_HOUR_FORMAT);

            if (checkInTime.isValid() && checkOutTime.isValid()) {
              const diff = checkOutTime.diff(checkInTime, "minute") - 90;
              const workedHours = diff > 0 ? (diff / 60).toFixed(1) : "0";
              return <span className={`font-semibold ${Number(workedHours) >= 8 ? "text-green-600" : "text-red-500"}`}>{workedHours}</span>;
            }
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
      title: "Mã nhân viên",
      dataIndex: "employee_code",
      key: "employee_code",
      width: 120,
      fixed: "left" as const,
      align: "center" as const,
    },
    {
      title: "Họ tên nhân viên",
      dataIndex: "employee_name",
      key: "employee_name",
      width: 180,
      fixed: "left" as const,
      align: "center" as const,
    },
    {
      title: "Tổng công",
      key: "total_check",
      width: 160,
      fixed: "left" as const,
      align: "center" as const,
      render: (_, record) => {
        const { totalHour, totalCheck } = calculateWorkTime(record.employee_check_in, record.employee_check_out);
        return (
          <div className="grid grid-cols-[48%_4%_48%] place-items-center text-center">
            <div>{totalHour.toFixed(1)} giờ</div>
            <div className="w-[1px] h-5 bg-black" />
            <div>{totalCheck} ngày</div>
          </div>
        );
      },
    },
    ...dayColumns,
    {
      title: "Chi tiết",
      key: "detail",
      fixed: "right" as const,
      align: "center" as const,
      render: (record) => (
        <div className="flex justify-center">
          <Button type="primary" onClick={() => DashboardModal(record, currentYear, currentMonth, days)}>
            Chi tiết
          </Button>
        </div>
      ),
    },
  ];

  const csvData = selectedRow.flatMap((row) => {
    const { totalHour, totalCheck } = calculateWorkTime(row.employee_check_in, row.employee_check_out);

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
          <Button type="primary">Xuất file CSV</Button>
        </CSVLink>
      )}
      <Table dataSource={dataSource} columns={columns} size="small" scroll={{ x: "max-content", y: 550 }} pagination={false} />
    </>
  );
}
