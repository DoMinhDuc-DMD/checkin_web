"use client";

import { DataType } from "@/app/constant/DataType";
import { CalculateWorkHour } from "@/app/utils/CalculateWorkHour";
import { Button } from "antd";
import { CSVLink } from "react-csv";

interface Props {
  selectedRow: DataType[];
  type: string;
  t: (key: string) => string;
}

export default function ExportData({ selectedRow, type, t }: Props) {
  if (selectedRow.length === 0 || !type) return null;

  const csvData = selectedRow.map((row) => {
    if (type === "attendance") {
      const { totalWorkingHour, totalCheck } = CalculateWorkHour(
        row.trackRecord.flatMap((r) => r.checkIn).filter((v): v is string => v !== null),
        row.trackRecord.flatMap((r) => r.checkOut).filter((v): v is string => v !== null)
      );

      return {
        userId: row.userId,
        name: row.displayName,
        email: row.email,
        role: row.role,
        totalCheck: `${totalCheck} ${totalCheck > 1 ? t("days") : t("day")}`,
        totalHour: `${totalWorkingHour} ${totalWorkingHour > 1 ? t("hours") : t("hour")}`,
      };
    } else if (type === "mistake") {
      return {
        userId: row.userId,
        name: row.displayName,
        email: row.email,
        role: row.role,
        checkInLate: `${row.checkInLateCount} ${row.checkInLateCount > 1 ? t("times") : t("time")}`,
        checkOutEarly: `${row.checkOutEarlyCount} ${row.checkOutEarlyCount > 1 ? t("times") : t("time")}`,
      };
    }
  });

  return (
    <CSVLink data={csvData} filename={`${type === "attendance" ? "staff_attendance_statistic" : "staff_mistake_statistic"}`}>
      <Button type="primary">{t("Export CSV")}</Button>
    </CSVLink>
  );
}
