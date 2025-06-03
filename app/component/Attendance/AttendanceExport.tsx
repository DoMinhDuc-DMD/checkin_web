"use client";

import { DataType } from "@/app/constant/DataType";
import { CalculateWorkHour } from "@/app/utils/CalculateWorkHour";
import { Button } from "antd";
import { CSVLink } from "react-csv";
import { useTranslation } from "react-i18next";

interface AttendanceExportProps {
  selectedRow: DataType[];
}

export default function AttendanceExport({ selectedRow }: AttendanceExportProps) {
  const { t } = useTranslation();

  const csvData = selectedRow.map((row) => {
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
  });

  return (
    <CSVLink className="ml-5" data={csvData} filename="employee_statistic">
      <Button type="primary">{t("Export CSV")}</Button>
    </CSVLink>
  );
}
