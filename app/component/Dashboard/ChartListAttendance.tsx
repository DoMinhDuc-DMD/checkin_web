"use client";

import { Col, Divider, Flex, List, Row, Spin } from "antd";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
import { useTranslation } from "react-i18next";
import { HOUR_FORMAT } from "@/app/constant/ConstantVariables";
import { User } from "@/app/constant/DataType";
import dayjs from "dayjs";

interface ChartListAttendanceProps {
  user: User[];
  analyzeDate: dayjs.Dayjs;
  analyzeData: { labels: string[]; datasets: { label: string; data: number[]; backgroundColor: string }[] };
  analyzeTracker: { onTime: number; inLate: number; outEarly: number };
  attendedEmployee: { user: User; firstCheckIn: dayjs.Dayjs }[];
  absentEmployee: User[];
  loading: boolean;
}

export default function ChartListAttendance({
  user,
  analyzeDate,
  analyzeData,
  analyzeTracker,
  attendedEmployee,
  absentEmployee,
  loading,
}: ChartListAttendanceProps) {
  const { t } = useTranslation();

  return (
    <Row gutter={[20, 20]} className="mb-3">
      {/* Phân tích chấm công */}
      <Col xs={24} md={24} xl={8}>
        <Spin spinning={loading}>
          <div className="h-[50vh] bg-white p-5 rounded shadow">
            <strong className="text-md">{t("Attendance analytic")}</strong>
            <Bar data={analyzeData} options={{ maintainAspectRatio: false }} />
          </div>
        </Spin>
      </Col>
      {/* Nhân viên có mặt */}
      <Col xs={24} md={12} xl={8}>
        <Spin spinning={loading}>
          <Flex vertical justify="space-around" className="h-[50vh] bg-white rounded shadow" style={{ padding: "1rem" }}>
            <strong className="text-md">
              {t("Employee attended")}: {analyzeTracker.onTime + analyzeTracker.inLate}/{user.length}
            </strong>
            <Divider style={{ borderColor: "black", marginTop: 0, marginBottom: 0 }} />
            <List
              className="overflow-y-scroll"
              style={{ height: "85%" }}
              bordered
              dataSource={attendedEmployee}
              renderItem={(item) => (
                <List.Item
                  style={{ backgroundColor: `${item.firstCheckIn.isBefore(dayjs(analyzeDate).hour(8).minute(31)) ? "#79FD9D" : ""}` }}
                >
                  <strong>{item.user.displayName}</strong>
                  <strong>{item.firstCheckIn.format(HOUR_FORMAT)}</strong>
                </List.Item>
              )}
            />
          </Flex>
        </Spin>
      </Col>
      {/* Nhân viên vắng mặt */}
      <Col xs={24} md={12} xl={8}>
        <Spin spinning={loading}>
          <Flex vertical justify="space-around" className="h-[50vh] bg-white rounded shadow" style={{ padding: "1rem" }}>
            <strong className="text-md">{t("Employee absented")}</strong>
            <Divider style={{ borderColor: "black", marginTop: 0, marginBottom: 0 }} />
            <List
              className="overflow-y-scroll"
              style={{ height: "85%" }}
              bordered
              dataSource={absentEmployee}
              renderItem={(item) => (
                <List.Item>
                  <strong>{item.displayName}</strong>
                </List.Item>
              )}
            />
          </Flex>
        </Spin>
      </Col>
    </Row>
  );
}
