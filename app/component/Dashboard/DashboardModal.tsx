"use client";

import { EmployeeTypeData } from "@/app/constant/DataType";
import { calculateWorkTime } from "@/app/utils/calculateWorkTime";
import { Modal } from "antd";
import dayjs from "dayjs";

export default function DashboardModal(record: EmployeeTypeData, currentYear: number, currentMonth: number, days: number[]) {
  const { totalHour, totalCheck } = calculateWorkTime(record.employee_check_in, record.employee_check_out);
  const workingDays = Array.from({ length: days.length }, (_, index) => {
    const date = dayjs(new Date(currentYear, currentMonth, index + 1));
    return date;
  }).filter((date) => {
    const dayOfWeek = date.day();
    return dayOfWeek !== 0 && dayOfWeek !== 6;
  });

  const parseTime = (check: string) => check?.split(", ")[1]?.split(":").map(Number) || [];

  const lateCheckInCount = record.employee_check_in.filter((check: string) => {
    const [hour, minute] = parseTime(check);
    return hour > 8 || (hour === 8 && minute > 30);
  }).length;

  const earlyCheckOutCount = record.employee_check_out.filter((check: string) => parseTime(check)[0] < 18).length;

  Modal.info({
    title: `Chi tiết chấm công tháng ${currentMonth + 1}`,
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
}
