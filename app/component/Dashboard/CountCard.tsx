"use client";
import { Card, Col, Flex } from "antd";
import { useTranslation } from "react-i18next";

interface CountCardProps {
  label: string;
  attendancePercentage?: number;
  attendanceCountType?: number;
  loading: boolean;
}
export default function CountCard({ label, attendancePercentage, attendanceCountType, loading }: CountCardProps) {
  const { t } = useTranslation();
  const isAttendance = (attendancePercentage ?? null) !== null;
  return (
    <Col xs={24} sm={12} lg={6}>
      <Card
        hoverable={loading ? false : true}
        style={{ backgroundColor: "oklch(0.93 0.01 0)", height: "15vh", display: "flex", alignItems: "center" }}
        loading={loading}
      >
        <Flex vertical gap={2}>
          <strong className="text-md">{t(label)}</strong>
          <p className="text-4xl">{isAttendance ? `${attendancePercentage?.toFixed(2)}%` : attendanceCountType}</p>
        </Flex>
      </Card>
    </Col>
  );
}
