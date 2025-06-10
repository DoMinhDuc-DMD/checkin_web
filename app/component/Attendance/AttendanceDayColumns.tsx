"use client";

import { DM_FORMAT, today } from "@/app/constant/ConstantVariables";
import { DataType } from "@/app/constant/DataType";
import { CalculateWorkMinute } from "@/app/utils/CalculateWorkMinute";
import { Tooltip } from "antd";
import dayjs from "dayjs";
import React from "react";

export default function AttendanceDayColumns(days: number[], selectedMonth: dayjs.Dayjs, t: (key: string) => string) {
  return days.map((day) => {
    const date = dayjs(new Date(selectedMonth.year(), selectedMonth.month(), day));
    const isWorkingDay = date.day() !== 0 && date.day() !== 6;

    return {
      title: date.format(DM_FORMAT),
      key: `day_${day}`,
      width: 70,
      align: "center" as const,
      onCell: () => ({ style: { backgroundColor: isWorkingDay ? "" : "oklch(0.90 0 0)" } }),
      render: (_, record: DataType) => {
        const foundDate = record.trackRecord.find((r) => dayjs(r.date).isSame(date, "day"));

        if (date > today) {
          return <span className="font-semibold">---</span>;
        }
        if (!foundDate) {
          if (!isWorkingDay) return <span className="font-semibold text-blue-500">{t("Off")}</span>;
          return <span className="font-semibold text-gray-600">{t("Leave")}</span>;
        }

        const { checkIn, checkOut } = foundDate;
        if (checkIn && !checkOut) {
          return (
            <Tooltip title={`${checkIn.split(", ")[1]}`}>
              <span className={`font-semibold text-green-600`}>{t("Checked")}</span>
            </Tooltip>
          );
        }
        const { workingMinute } = CalculateWorkMinute(checkIn, checkOut);
        const workedHours = (workingMinute / 60).toFixed(2);
        return (
          <Tooltip title={`${checkIn.split(", ")[1]} - ${checkOut.split(", ")[1]}`}>
            <span className={`font-semibold ${Number(workedHours) >= 8 ? "text-green-600" : "text-red-400"}`}>{workedHours}</span>
          </Tooltip>
        );
      },
    };
  });
}
