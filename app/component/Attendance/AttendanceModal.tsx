"use client";

import { User, UserTrackerRecord } from "@/app/constant/DataType";
import { MY_FORMAT, DMY_FORMAT } from "@/app/constant/ConstantVariables";
import { CalculateWorkHour } from "@/app/utils/CalculateWorkHour";
import { Col, Modal, Row, Space } from "antd";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import AttendanceModalText from "./AttendanceModalText";

interface AttendanceModalProps {
  openModal: boolean;
  user: User[];
  record: UserTrackerRecord;
  selectedMonth: dayjs.Dayjs;
  days: number[];
  onClose: () => void;
}

export default function AttendanceModal({ openModal, user, record, selectedMonth, days, onClose }: AttendanceModalProps) {
  const { t } = useTranslation();
  const { totalWorkingHour, totalCheck, totalOvertimeHour } = CalculateWorkHour(
    record.records.flatMap((r) => r.checkIn).filter((v): v is string => v !== null),
    record.records.flatMap((r) => r.checkOut).filter((v): v is string => v !== null)
  );

  // Tính số ngày đi làm trong tháng
  const workingDays = Array.from({ length: days.length }, (_, index) => {
    const date = dayjs(new Date(selectedMonth.year(), selectedMonth.month(), index + 1));
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
      title={`${t("Attendance detail")} ${t(dayjs(selectedMonth).format(MY_FORMAT))}`}
      width={750}
    >
      <Row className="mt-6">
        <Col span={10} offset={1}>
          <Space direction="vertical">
            <AttendanceModalText label={t("Code")} value={record.userId} />
            <AttendanceModalText label={t("Name")} value={user.find((u) => u._id === record?.userId)?.displayName} />
            <AttendanceModalText label={t("Position")} value={user.find((u) => u._id === record?.userId)?.role} />
            <AttendanceModalText
              label={t("Joined at")}
              value={dayjs(user.find((u) => u._id === record?.userId)?.createdAt).format(DMY_FORMAT)}
            />
          </Space>
        </Col>
        <Col span={10} offset={2}>
          <Space direction="vertical">
            <AttendanceModalText label={t("Working days")} value={`${totalCheck}/${workingDays.length} ${t("days")}`} />
            <AttendanceModalText label={t("Working hours")} value={`${totalWorkingHour} ${t("hours")}`} />
            <AttendanceModalText label={t("Overtime hours")} value={`${totalOvertimeHour} ${t("hours")}`} />
            <AttendanceModalText label={t("Check in late times")} value={`${lateCheckInCount} ${t("times")}`} />
            <AttendanceModalText label={t("Check out early times")} value={`${earlyCheckOutCount} ${t("times")}`} />
          </Space>
        </Col>
      </Row>
    </Modal>
  );
}
