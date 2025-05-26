"use client";

import { User } from "@/app/constant/DataType";
import { UserTrackerRecord } from "@/app/main/Attendance/page";
import { CalculateWorkHour } from "@/app/utils/CalculateWorkHour";
import { Button } from "antd";
import { CSVLink } from "react-csv";
import { useTranslation } from "react-i18next";

interface AttendanceExportProps {
  user: User[];
  selectedRow: UserTrackerRecord[];
}

export default function AttendanceExport({ user, selectedRow }: AttendanceExportProps) {
  const { t } = useTranslation();

  const csvData = selectedRow.flatMap((row) => {
    const userInfo = user.find((u) => u._id === row.userId);
    const { totalHour, totalCheck } = CalculateWorkHour(
      row.records.flatMap((r) => r.checkIn).filter((v): v is string => v !== null),
      row.records.flatMap((r) => r.checkOut).filter((v): v is string => v !== null)
    );

    return {
      userId: row.userId,
      name: userInfo?.displayName,
      totalCheck: totalCheck,
      totalHour: totalHour,
      role: userInfo?.role,
      createdAt: userInfo?.createdAt,
    };
  });

  return (
    <CSVLink className="ml-5" data={csvData} filename="employee_statistic">
      <Button type="primary">{t("Export CSV")}</Button>
    </CSVLink>
  );
}
