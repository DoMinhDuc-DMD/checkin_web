"use client";

import "@ant-design/v5-patch-for-react-19";
import { Flex, Table, Typography } from "antd";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { dataSource } from "@/app/TestData/data";
import { DATE_FORMAT, SHOW_DAY_MONTH_FORMAT } from "@/app/constant/DateFormatting";

export default function InLateOutEarly() {
  const { Title } = Typography;

  const { t } = useTranslation();

  const today = dayjs();
  const currentMonth = today.month();
  const currentYear = today.year();
  const daysInMonth = today.daysInMonth();

  const days = Array.from({ length: daysInMonth }, (_, index) => index + 1);

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

          const isInLate = checkIn && dayjs(checkIn).isAfter(dayjs(checkIn).hour(8).minute(30));
          const isOutEarly = checkOut && dayjs(checkOut).isBefore(dayjs(checkOut).hour(18));
          const checkInClass = isInLate ? "text-red-500" : "text-green-600";
          const checkOutClass = isOutEarly ? "text-red-500" : "text-green-600";

          if (checkIn && checkOut) {
            return (
              <Flex vertical align="center" className="font-semibold">
                <span className={`${checkInClass}`}>{checkIn.split(", ")[1]}</span>
                <div className="w-full h-[1px] bg-black my-1" />
                <span className={`${checkOutClass}`}>{checkOut.split(", ")[1]}</span>
              </Flex>
            );
          } else if (checkIn) {
            return <span className={`font-semibold ${checkInClass}`}>{checkIn.split(", ")[1]}</span>;
          } else {
            return <span className="font-semibold">---</span>;
          }
        }
      },
    };
  });

  const columns = [
    {
      title: `${t("ID")}`,
      key: "id",
      align: "center" as const,
      width: 50,
      fixed: "left" as const,
      render: (_, __, index: number) => index + 1,
    },
    {
      title: `${t("Name")}`,
      dataIndex: "employee_name",
      key: "employee_name",
      width: 200,
      fixed: "left" as const,
      align: "center" as const,
    },
    ...dayColumns,
  ];
  return (
    <>
      <Title level={3} className="flex justify-center font-semibold my-3">
        {t("Employee in late, out early")}
      </Title>
      <Table
        dataSource={dataSource}
        columns={columns}
        size="small"
        scroll={{ x: "max-content", y: "calc(100vh - 50px - 48px - 56px - 39px)" }}
        // full height - header - p/m - title - table header
        pagination={false}
      />
    </>
  );
}
