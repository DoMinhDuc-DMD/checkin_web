"use client";

import { User } from "@/app/constant/DataType";
import { SHOW_MONTH_YEAR_FORMAT, SHOW_DATE_FORMAT } from "@/app/constant/DateFormatting";
import { UserTrackerRecord } from "@/app/main/Attendance/page";
import { CalculateWorkHour } from "@/app/utils/CalculateWorkHour";
import { Col, Modal, Row, Space, Typography } from "antd";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

interface AttendanceModalProps {
  openModal: boolean;
  user: User[];
  record: UserTrackerRecord;
  currentYear: number;
  currentMonth: number;
  days: number[];
  onClose: () => void;
}

export default function AttendanceModal({ openModal, user, record, currentYear, currentMonth, days, onClose }: AttendanceModalProps) {
  const { t } = useTranslation();
  const { totalHour, totalCheck } = CalculateWorkHour(
    record.records.flatMap((r) => r.checkIn).filter((v): v is string => v !== null),
    record.records.flatMap((r) => r.checkOut).filter((v): v is string => v !== null)
  );

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
  const lateCheckInCount = record.records
    .map((r) => r.checkIn)
    .filter((check: string) => parseTime(check)[0] > 8 || (parseTime(check)[0] === 8 && parseTime(check)[1] > 30)).length;
  const earlyCheckOutCount = record.records.map((r) => r.checkOut).filter((check: string) => parseTime(check)[0] < 18).length;

  return (
    <Modal
      open={openModal}
      onCancel={onClose}
      onOk={onClose}
      title={`${t("Attendance detail")} ${t(dayjs().format(SHOW_MONTH_YEAR_FORMAT))}`}
      width={800}
    >
      <Row>
        <Col span={10} offset={1}>
          <Space direction="vertical">
            <Typography.Text>
              {t("Code")}: {record.userId}
            </Typography.Text>
            <Typography.Text>
              {t("Name")}: {user.find((u) => u._id === record?.userId)?.displayName}
            </Typography.Text>
            <Typography.Text>
              {t("Position")}: {user.find((u) => u._id === record?.userId)?.role}
            </Typography.Text>
            <Typography.Text>
              {t("Joined at")}: {dayjs(user.find((u) => u._id === record?.userId)?.createdAt).format(SHOW_DATE_FORMAT)}
            </Typography.Text>
          </Space>
        </Col>
        <Col span={10} offset={2}>
          <Space direction="vertical">
            <Typography.Text>
              {t("Working days")}: {totalCheck}/{workingDays.length} {t("days")}
            </Typography.Text>
            <Typography.Text>
              {t("Working hours")}: {totalHour} {t("hours")}
            </Typography.Text>
            <Typography.Text>
              {t("Check in late")}: {lateCheckInCount} {t("times")}
            </Typography.Text>
            <Typography.Text>
              {t("Check out early")}: {earlyCheckOutCount} {t("times")}
            </Typography.Text>
          </Space>
        </Col>
      </Row>
    </Modal>
  );
}
