"use client";

import { EmployeeTypeData } from "@/app/constant/DataType";
import { CalculateWorkHour } from "@/app/utils/CalculateWorkHour";
import { Col, Modal, Row, Space, Typography } from "antd";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

interface DashboardModalProps {
  openModal: boolean;
  record: EmployeeTypeData;
  currentYear: number;
  currentMonth: number;
  days: number[];
  onClose: () => void;
}

export default function DashboardModal({ openModal, record, currentYear, currentMonth, days, onClose }: DashboardModalProps) {
  const { t } = useTranslation();
  const { Text } = Typography;
  const { totalHour, totalCheck } = CalculateWorkHour(record.employee_check_in, record.employee_check_out);

  // Tính tổng ngày làm việc
  const workingDays = Array.from({ length: days.length }, (_, index) => {
    const date = dayjs(new Date(currentYear, currentMonth, index + 1));
    return date;
  }).filter((date) => {
    const dayOfWeek = date.day();
    return dayOfWeek !== 0 && dayOfWeek !== 6;
  });

  // Tính ngày check in muộn, check out sớm
  const parseTime = (check: string) => check?.split(", ")[1]?.split(":").map(Number) || [];
  const lateCheckInCount = record.employee_check_in.filter(
    (check: string) => parseTime(check)[0] > 8 || (parseTime(check)[0] === 8 && parseTime(check)[1] > 30)
  ).length;
  const earlyCheckOutCount = record.employee_check_out.filter((check: string) => parseTime(check)[0] < 18).length;

  return (
    <Modal open={openModal} onCancel={onClose} onOk={onClose} title={t("Attendance detail")} width={600}>
      <Row>
        <Col span={10} offset={1}>
          <Space direction="vertical">
            <Text>
              {t("Code")}: {record.employee_code}
            </Text>
            <Text>
              {t("Name")}: {record.employee_name}
            </Text>
            <Text>
              {t("Department")}: {record.employee_department}
            </Text>
            <Text>
              {t("Position")}: {record.employee_position}
            </Text>
          </Space>
        </Col>
        <Col span={10} offset={2}>
          <Space direction="vertical">
            <Text>
              {t("Working days")}: {totalCheck}/{workingDays.length} {t("days")}
            </Text>
            <Text>
              {t("Working hours")}: {totalHour} {t("hours")}
            </Text>
            <Text>
              {t("Check in late")}: {lateCheckInCount} {t("times")}
            </Text>
            <Text>
              {t("Check out early")}: {earlyCheckOutCount} {t("times")}
            </Text>
          </Space>
        </Col>
      </Row>
    </Modal>
  );
}
