"use client";

import { Typography } from "antd";

interface AttendanceModalTextProps {
  label: string;
  value?: string;
}

export default function AttendanceModalText({ label, value }: AttendanceModalTextProps) {
  return (
    <Typography.Text>
      <strong> {label}</strong>: {value}
    </Typography.Text>
  );
}
