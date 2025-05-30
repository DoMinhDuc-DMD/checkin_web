"use client";

import { DatePicker, Flex, Row } from "antd";
import { useState } from "react";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import CountCard from "../component/Dashboard/CountCard";
import UseFetchData from "../hooks/UseFetchData";
import { today } from "../constant/ConstantVariables";
import AnalyzeData from "../component/Dashboard/AnalyzeData";
import ChartListAttendance from "../component/Dashboard/ChartListAttendance";

export default function NewDashboard() {
  const { t } = useTranslation();
  const { user, tracker } = UseFetchData();

  const [analyzeDate, setAnalyzeDate] = useState<dayjs.Dayjs | null>(today);
  const { todayAttendance, attendanceCount, attendedEmployee, absentEmployee, analyzeTracker } = AnalyzeData({
    user,
    tracker,
    analyzeDate,
  });

  const handleAnalyzeDateChange = (value: dayjs.Dayjs | null) => {
    if (!value) {
      setAnalyzeDate(today);
      return;
    }
    setAnalyzeDate(value);
  };

  const analyzeData = {
    labels: [t("On time"), t("In late"), t("Out early")],
    datasets: [
      { label: t("Employee"), data: [analyzeTracker.onTime, analyzeTracker.inLate, analyzeTracker.outEarly], backgroundColor: "blue" },
    ],
  };

  return (
    <Flex gap={40} vertical>
      <Row gutter={[20, 20]} justify="space-between">
        <CountCard label="Today attendance" attendancePercentage={todayAttendance} />
        <CountCard label="On time" attendanceCountType={attendanceCount.onTime} />
        <CountCard label="In late" attendanceCountType={attendanceCount.inLate} />
        <CountCard label="Out early" attendanceCountType={attendanceCount.outEarly} />
      </Row>
      <Flex justify="end">
        <DatePicker value={analyzeDate} onChange={handleAnalyzeDateChange} />
      </Flex>
      <ChartListAttendance
        user={user}
        analyzeDate={analyzeDate}
        analyzeData={analyzeData}
        analyzeTracker={analyzeTracker}
        attendedEmployee={attendedEmployee}
        absentEmployee={absentEmployee}
      />
    </Flex>
  );
}
