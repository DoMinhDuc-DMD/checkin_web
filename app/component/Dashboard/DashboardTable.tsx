"use client";

import { DATE_FORMAT, DATE_HOUR_FORMAT, SHOW_DAY_MONTH_FORMAT } from "@/app/constant/dateFormat";
import { calculateWorkTime } from "@/app/utils/calculateWorkTime";
import { Button, Table, Modal } from "antd";
import dayjs, { Dayjs } from "dayjs";

interface DashboardTableProps {
  days: number[];
  currentYear: number;
  currentMonth: number;
  dataSource: {
    key: string;
    employee_code: string;
    employee_name: string;
    employee_department: string;
    employee_position: string;
    employee_check_in: string[];
    employee_check_out: string[];
  }[];
  workingDays: Dayjs[];
}

export default function DashboardTable({ days, currentYear, currentMonth, dataSource, workingDays }: DashboardTableProps) {
  const dayColumns = days.map((day) => ({
    title: dayjs(`${currentYear}-${currentMonth}-${day}`).format(SHOW_DAY_MONTH_FORMAT),
    key: `day_${day}`,
    width: 70,
    align: "center" as const,
    render: (_, record) => {
      const dateStr = dayjs(`${currentYear}-${currentMonth}-${day}`).format(DATE_FORMAT);
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
          return <span className={`${Number(workedHours) >= 8 ? "text-green-600" : "text-red-500"}`}>{workedHours}</span>;
        }
      }

      return <span>-</span>;
    },
  }));

  const columns = [
    {
      title: "STT",
      key: "id",
      align: "center" as const,
      width: 60,
      fixed: "left" as const,
      render: (_: unknown, __: unknown, index: number) => index + 1,
    },
    {
      title: "Mã NV",
      dataIndex: "employee_code",
      key: "employee_code",
      width: 80,
      fixed: "left" as const,
      align: "center" as const,
    },
    {
      title: "Họ và tên",
      dataIndex: "employee_name",
      key: "employee_name",
      width: 150,
      fixed: "left" as const,
      align: "center" as const,
    },
    {
      title: "Tổng công",
      key: "total_check",
      width: 160,
      fixed: "left" as const,
      align: "center" as const,
      render: (_: any, record: any) => {
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
          <Button type="primary" onClick={() => info(record)}>
            Chi tiết
          </Button>
        </div>
      ),
    },
  ];

  const info = (record) => {
    const { totalHour, totalCheck } = calculateWorkTime(record.employee_check_in, record.employee_check_out);
    const parseTime = (check: string) => check?.split(", ")[1]?.split(":").map(Number) || [];

    const lateCheckInCount = record.employee_check_in.filter((check: string) => {
      const [hour, minute] = parseTime(check);
      return hour > 8 || (hour === 8 && minute > 30);
    }).length;

    const earlyCheckOutCount = record.employee_check_out.filter((check: string) => parseTime(check)[0] < 18).length;

    Modal.info({
      title: `Chi tiết chấm công tháng `,
      width: 600,
      content: (
        <div className="grid grid-cols-2">
          <div>
            <p>Mã nhân viên: {record.employee_code}</p>
            <p>Họ và tên: {record.employee_name}</p>
            <p>Phòng ban: {record.employee_department}</p>
            <p>Vị trí: {record.employee_position}</p>
          </div>
          <div>
            <p>
              Số ngày làm việc: {totalCheck}/{workingDays.length} ngày
            </p>
            <p>Thời gian làm việc: {totalHour} giờ</p>
            <p>Số lần check in muộn: {lateCheckInCount} lần</p>
            <p>Số lần check out sớm: {earlyCheckOutCount} lần</p>
          </div>
        </div>
      ),
      onOk() {},
    });
  };

  return <Table dataSource={dataSource} columns={columns} size="small" scroll={{ x: "max-content", y: 550 }} pagination={false} />;
}
