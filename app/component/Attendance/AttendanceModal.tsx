"use client";

import { DataType } from "@/app/constant/DataType";
import { MY_FORMAT, DMY_FORMAT } from "@/app/constant/ConstantVariables";
import { CalculateWorkHour } from "@/app/utils/CalculateWorkHour";
import { Button, Col, Modal, Row, Space } from "antd";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import AttendanceModalText from "./AttendanceModalText";

interface AttendanceModalProps {
  openModal: boolean;
  record: DataType;
  selectedName: string;
  selectedMonth: dayjs.Dayjs;
  days: number[];
  onClose: () => void;
}

export default function AttendanceModal({ openModal, record, selectedName, selectedMonth, days, onClose }: AttendanceModalProps) {
  const { t } = useTranslation();
  const { totalWorkingHour, totalCheck, totalOvertimeHour } = CalculateWorkHour(
    record.trackRecord.flatMap((r) => r.checkIn).filter((v): v is string => v !== null),
    record.trackRecord.flatMap((r) => r.checkOut).filter((v): v is string => v !== null)
  );

  // Tính số ngày đi làm trong tháng
  const workingDays = Array.from({ length: days.length }, (_, index) => {
    const date = dayjs(new Date(selectedMonth.year(), selectedMonth.month(), index + 1));
    return date;
  }).filter((date) => {
    const dayOfWeek = date.day();
    return dayOfWeek !== 0 && dayOfWeek !== 6;
  });

  // Dịch đơn vị
  const daysUnit = `${totalCheck > 1 ? t("days") : t("day")}`;
  const hoursUnit = `${totalWorkingHour > 1 ? t("hours") : t("hour")}`;
  const overtimeUnit = `${totalOvertimeHour > 1 ? t("hours") : t("hour")}`;
  const lateTimesUnit = `${record.checkInLateCount > 1 ? t("times") : t("time")}`;
  const earlyTimesUnit = `${record.checkOutEarlyCount > 1 ? t("times") : t("time")}`;

  return (
    <Modal
      open={openModal}
      title={`${t("Attendance detail of")} ${selectedName} ${t("in")} ${t(dayjs(selectedMonth).format(MY_FORMAT))}`}
      width={750}
      onCancel={onClose}
      closeIcon={false}
      footer={
        <Button color="danger" variant="solid" onClick={onClose}>
          {t("Close")}
        </Button>
      }
    >
      <Row className="mt-6">
        <Col span={10} offset={1}>
          <Space direction="vertical">
            <AttendanceModalText label={t("Code")} value={record.userId} />
            <AttendanceModalText label={t("Name")} value={record.displayName} />
            <AttendanceModalText label={t("Position")} value={record.role} />
            <AttendanceModalText label={t("Joined at")} value={dayjs(record.createdAt).format(DMY_FORMAT)} />
          </Space>
        </Col>
        <Col span={10} offset={2}>
          <Space direction="vertical">
            <AttendanceModalText label={t("Working days")} value={`${totalCheck}/${workingDays.length} ${daysUnit}`} />
            <AttendanceModalText label={t("Working hours")} value={`${totalWorkingHour} ${hoursUnit}`} />
            <AttendanceModalText label={t("Overtime hours")} value={`${totalOvertimeHour} ${overtimeUnit}`} />
            <AttendanceModalText label={t("Check in late times")} value={`${record.checkInLateCount} ${lateTimesUnit}`} />
            <AttendanceModalText label={t("Check out early times")} value={`${record.checkOutEarlyCount} ${earlyTimesUnit}`} />
          </Space>
        </Col>
      </Row>
    </Modal>
  );
}
