"use client";

import { EmployeeTypeData } from "@/app/constant/DataType";
import { calculateWorkTime } from "@/app/utils/CalculateWorkTime";
import { Col, Modal, Row, Space, Typography } from "antd";
import dayjs from "dayjs";

export default function DashboardModal(record: EmployeeTypeData, currentYear: number, currentMonth: number, days: number[]) {
  const { Text } = Typography;
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
      <Row>
        <Col span={10}>
          <Space direction="vertical">
            <Text>Mã nhân viên: {record.employee_code}</Text>
            <Text>Họ và tên: {record.employee_name}</Text>
            <Text>Phòng ban: {record.employee_department}</Text>
            <Text>Vị trí: {record.employee_position}</Text>
          </Space>
        </Col>
        <Col span={10} offset={2}>
          <Space direction="vertical">
            <Text>
              Số ngày làm việc: {totalCheck}/{workingDays.length} ngày
            </Text>
            <Text>Thời gian làm việc: {totalHour} giờ</Text>
            <Text>Số lần check in muộn: {lateCheckInCount} lần</Text>
            <Text>Số lần check out sớm: {earlyCheckOutCount} lần</Text>
          </Space>
        </Col>
      </Row>
    ),
    onOk() {},
  });
}
