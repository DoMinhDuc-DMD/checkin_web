"use client";

import "dayjs/locale/vi";
import "@ant-design/v5-patch-for-react-19";
import { Table } from "antd";
import { dataSource } from "../TestData/data";
import dayjs from "dayjs";
import { SHOW_DAY_MONTH_FORMAT } from "../constant/dateFormat";

export default function Main() {
  const today = dayjs();
  const currentMonth = today.month();
  const currentYear = today.year();
  const daysInMonth = today.daysInMonth();

  const days = Array.from({ length: daysInMonth }, (_, i) => dayjs(new Date(currentYear, currentMonth, i + 1)).format("DD/MM"));

  const dayColumns = days.map((day) => ({
    title: `${day}`,
    key: `day_${day}`,
    width: 70,
    align: "center" as const,
    render: (_, record) => {
      const checkIn = record.employee_check_in || [];
      const checkOut = record.employee_check_out || [];

      const checkInDay = checkIn
        .map((entry: string) => {
          const [dateStr, timeStr] = entry.split(", ");
          return { date: dayjs(dateStr).format(SHOW_DAY_MONTH_FORMAT), time: timeStr, full: `${dateStr} ${timeStr}` };
        })
        .find((ci) => ci.date === day);

      const checkOutDay = checkOut
        .map((entry: string) => {
          const [dateStr, timeStr] = entry.split(", ");
          return { date: dayjs(dateStr).format(SHOW_DAY_MONTH_FORMAT), time: timeStr, full: `${dateStr} ${timeStr}` };
        })
        .find((co) => co.date === day);

      const isInLate = checkInDay && dayjs(checkInDay.full).isAfter(dayjs(checkInDay.full).hour(8).minute(30));
      const isOutEarly = checkOutDay && dayjs(checkOutDay.full).isBefore(dayjs(checkOutDay.full).hour(18).minute(0));

      const checkInClass = isInLate ? "text-red-500" : "text-green-600";
      const checkOutClass = isOutEarly ? "text-red-500" : "text-green-600";

      if (checkInDay && checkOutDay) {
        return (
          <div className="flex flex-col items-center font-semibold">
            <span className={`${checkInClass}`}>{checkInDay.time}</span>
            <div className="w-full h-[1px] bg-black my-1" />
            <span className={`${checkOutClass}`}>{checkOutDay.time}</span>
          </div>
        );
      } else if (checkInDay) {
        return <span className={`text-green-600 font-semibold ${checkInClass}`}>{checkInDay.time}</span>;
      } else {
        return <span className="text-gray-400">---</span>;
      }
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
    ...dayColumns,
  ];
  return (
    <>
      <div className="flex justify-center text-2xl font-semibold my-3">Tổng quan chấm công của nhân viên</div>
      <Table dataSource={dataSource} columns={columns} size="small" scroll={{ x: "max-content", y: 580 }} pagination={false} />
    </>
  );
}
