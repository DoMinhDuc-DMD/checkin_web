"use client";
import { Card, Flex } from "antd";
import { useTranslation } from "react-i18next";

interface CountCardProps {
  label: string;
  attendancePercentage?: number;
  attendanceCountType?: number;
}
export default function CountCard({ label, attendancePercentage, attendanceCountType }: CountCardProps) {
  const { t } = useTranslation();
  const isAttendance = (attendancePercentage ?? null) !== null;
  return (
    <Card hoverable style={{ backgroundColor: "oklch(0.93 0.01 0)", width: isAttendance ? "" : "23%" }}>
      <Flex vertical gap={2}>
        <strong className="text-lg">{t(label)}</strong>
        <p className="text-3xl">{isAttendance ? `${attendancePercentage?.toFixed(2)}%` : attendanceCountType}</p>
      </Flex>
    </Card>
  );
}
