"use client";

import { Card, Col, Flex } from "antd";

interface CountCardProps {
  label: string;
  attendancePercentage?: number;
  attendanceCountType?: number;
  t: (key: string) => string;
}
export default function CountCard({ label, attendancePercentage, attendanceCountType, t }: CountCardProps) {
  const isAttendance = (attendancePercentage ?? null) !== null;
  return (
    <Col xs={24} sm={12} lg={6}>
      <Card hoverable style={{ backgroundColor: "oklch(0.93 0.01 0)", height: "15vh", display: "flex", alignItems: "center" }}>
        <Flex vertical gap={2}>
          <strong className="text-md">{t(label)}</strong>
          <p className="text-4xl">{isAttendance ? `${attendancePercentage?.toFixed(2)}%` : attendanceCountType}</p>
        </Flex>
      </Card>
    </Col>
  );
}
