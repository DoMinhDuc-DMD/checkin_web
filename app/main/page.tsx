"use client";

import { ConfigProvider, DatePicker, Flex, Row } from "antd";
import { useState } from "react";
import CountCard from "../component/Dashboard/CountCard";
import UseFetchData from "../hooks/UseFetchData";
import { today } from "../constant/ConstantVariables";
import AnalyzeData from "../component/Dashboard/AnalyzeData";
import ChartListAttendance from "../component/Dashboard/ChartListAttendance";
import { useTranslation } from "react-i18next";
import { antdLocales } from "@/locales/antdLocales";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import "dayjs/locale/en";

export default function NewDashboard() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  dayjs.locale(currentLang);

  const { user, tracker, loading } = UseFetchData();
  const [analyzeDate, setAnalyzeDate] = useState<dayjs.Dayjs>(today);

  const { todayAttendance, attendanceCount, attendedStaff, absentStaff, analyzeTracker } = AnalyzeData({
    user,
    tracker,
    analyzeDate,
  });

  const handleAnalyzeDateChange = (value: dayjs.Dayjs) => {
    setAnalyzeDate(value);
  };

  const analyzeData = {
    labels: [t("On time"), t("In late"), t("Out early")],
    datasets: [
      { label: t("Staff"), data: [analyzeTracker.onTime, analyzeTracker.inLate, analyzeTracker.outEarly], backgroundColor: "blue" },
    ],
  };

  return (
    <Flex gap={40} vertical>
      <Row gutter={[10, 10]} justify="space-between">
        <CountCard label="Today attendance" attendancePercentage={todayAttendance} loading={loading} />
        <CountCard label="On time" attendanceCountType={attendanceCount.onTime} loading={loading} />
        <CountCard label="In late" attendanceCountType={attendanceCount.inLate} loading={loading} />
        <CountCard label="Out early" attendanceCountType={attendanceCount.outEarly} loading={loading} />
      </Row>
      <ConfigProvider locale={antdLocales[currentLang]}>
        <Flex justify="end">
          <DatePicker value={loading ? null : analyzeDate} onChange={handleAnalyzeDateChange} allowClear={false} disabled={loading} />
        </Flex>
      </ConfigProvider>
      <ChartListAttendance
        user={user}
        analyzeDate={analyzeDate}
        analyzeData={analyzeData}
        analyzeTracker={analyzeTracker}
        attendedStaff={attendedStaff}
        absentStaff={absentStaff}
        loading={loading}
      />
    </Flex>
  );
}
