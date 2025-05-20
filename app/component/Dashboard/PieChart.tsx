"use client";
import { DatePicker, Flex } from "antd";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, BarElement, ArcElement, Title, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
ChartJS.register(CategoryScale, LinearScale, PointElement, BarElement, ArcElement, Title, Tooltip, Legend);
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

interface PieChartProps {
  label: string;
  selectedMonth: dayjs.Dayjs | null;
  typeData: { labels: string[]; datasets: { data: number[]; backgroundColor: string[] }[] };
  handleWorkingMonthChange: (value: dayjs.Dayjs | null) => void;
}

export default function PieChart({ label, selectedMonth, typeData, handleWorkingMonthChange }: PieChartProps) {
  const { t } = useTranslation();
  return (
    <div className="w-[31%] min-h-[300px] bg-gray-200 p-5 rounded">
      <strong className="text-lg">{t(label)}</strong>
      <Flex justify="end">
        <DatePicker picker="month" value={selectedMonth} onChange={handleWorkingMonthChange} />
      </Flex>
      <Pie data={typeData} />
    </div>
  );
}
