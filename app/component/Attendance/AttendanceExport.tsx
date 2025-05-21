"use client";

import { EmployeeTypeData } from "@/app/constant/DataType";
import { CalculateWorkHour } from "@/app/utils/CalculateWorkHour";
import { Button } from "antd";
import { CSVLink } from "react-csv";
import { useTranslation } from "react-i18next";

interface AttendanceExportProps {
  selectedRow: EmployeeTypeData[];
}

export default function AttendanceExport({ selectedRow }: AttendanceExportProps) {
  const { t } = useTranslation();
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
    <CSVLink className="ml-5" data={csvData} filename="employee_statistic">
      <Button type="primary">{t("Export CSV")}</Button>
    </CSVLink>
  );
}
