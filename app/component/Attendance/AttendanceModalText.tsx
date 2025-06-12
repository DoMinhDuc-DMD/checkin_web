"use client";

import { Typography } from "antd";

interface Props {
  label: string;
  value?: string;
}

export default function AttendanceModalText({ label, value }: Props) {
  return (
    <Typography.Text>
      <strong> {label}</strong>: {value}
    </Typography.Text>
  );
}
