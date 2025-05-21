"use client";

import "@ant-design/v5-patch-for-react-19";
import { Checkbox, DatePicker, Flex, Table, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { dataSource } from "@/app/TestData/data";
import { useEffect, useState } from "react";
import Search from "antd/es/input/Search";
import { v4 as uuidv4 } from "uuid";
import { useCustomNotification } from "@/app/hooks/UseCustomNotification";
import { SHOW_DATE_FORMAT, SHOW_MONTH_YEAR_FORMAT } from "@/app/constant/DateFormatting";
import dayjs from "dayjs";

type MistakeRecord = {
  key: string;
  employee_code: string;
  employee_name: string;
  date: string;
  checkIn: string;
  checkOut: string;
  typeMistake: string;
};

export default function InLateOutEarly() {
  const { Title } = Typography;
  const { t } = useTranslation();
  const [mistakeRecord, setMistakeRecord] = useState<MistakeRecord[]>([]);
  const [mistakeRecordSearched, setMistakeRecordSearched] = useState<MistakeRecord[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [selectedRow, setSelectedRow] = useState<MistakeRecord[]>([]);
  const { openNotification, contextHolder } = useCustomNotification();

  const searchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleSearch = (value: string) => {
    setSearchInput(value);
    if (!value) {
      setMistakeRecordSearched(mistakeRecord);
      return;
    }
    const searchTerm = value.toLowerCase();
    const filteredData = mistakeRecord.filter((data) => data.employee_name.toLowerCase().includes(searchTerm));
    if (filteredData.length === 0) {
      openNotification(t("Notice"), t("No suitable employee found!"));
      return;
    }
    setMistakeRecordSearched(filteredData);
  };

  const handleDateChange = (value: dayjs.Dayjs) => {
    if (!value) {
      setMistakeRecordSearched(mistakeRecord);
      return;
    }
    const filteredData = mistakeRecord.filter((record) => record.date.includes(value.format(SHOW_MONTH_YEAR_FORMAT)));
    setMistakeRecordSearched(filteredData);
  };

  const isSelectedAll = selectedRow.length === mistakeRecordSearched.length && mistakeRecordSearched.length > 0;
  const handleSelectAll = () => {
    setSelectedRow(isSelectedAll ? [] : mistakeRecordSearched);
  };
  const handleCheckBoxChange = (row: MistakeRecord) => {
    setSelectedRow((prev) => (prev.some((r) => row.key === r.key) ? prev.filter((r) => r.key !== row.key) : [...prev, row]));
  };

  useEffect(() => {
    const record: MistakeRecord[] = [];
    dataSource.forEach((e) => {
      for (let i = 0; i < e.employee_check_in.length; i++) {
        const checkInRaw = e.employee_check_in[i];
        const checkOutRaw = e.employee_check_out[i];
        const [dateInStr, checkInTime] = checkInRaw.split(", ");
        const checkOutTime = checkOutRaw.split(", ")[1];

        if (checkInTime > "08:30" || checkOutTime < "18:00") {
          record.push({
            key: `${uuidv4()}_${e.employee_code}`,
            employee_code: e.employee_code,
            employee_name: e.employee_name,
            date: dayjs(dateInStr).format(SHOW_DATE_FORMAT),
            checkIn: checkInTime,
            checkOut: checkOutTime,
            typeMistake:
              checkInTime > "08:30" && checkOutTime < "18:00"
                ? t("In late and out early")
                : checkInTime > "08:30"
                ? t("In late")
                : t("Out early"),
          });
        }
      }
    });
    const sorted = record.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setMistakeRecord(sorted);
    setMistakeRecordSearched(sorted);
  }, [dataSource, t]);

  const columns = [
    {
      title: <Checkbox checked={isSelectedAll} indeterminate={selectedRow.length > 0 && !isSelectedAll} onChange={handleSelectAll} />,
      key: "key",
      align: "center" as const,
      width: 50,
      render: (row: MistakeRecord) => {
        const isChecked = selectedRow.some((acc) => acc.key === row.key);
        return <Checkbox checked={isChecked} onChange={() => handleCheckBoxChange(row)} />;
      },
    },
    {
      title: `${t("Name")}`,
      dataIndex: "employee_name",
      key: "employee_name",
      width: 200,
      align: "center" as const,
    },
    {
      title: `${t("Attendance date")}`,
      dataIndex: "date",
      key: "date",
      width: 200,
      align: "center" as const,
    },
    {
      title: `${t("Check in")}`,
      dataIndex: "checkIn",
      key: "checkIn",
      width: 200,
      align: "center" as const,
    },
    {
      title: `${t("Check out")}`,
      dataIndex: "checkOut",
      key: "checkOut",
      width: 200,
      align: "center" as const,
    },
    {
      title: `${t("Type mistake")}`,
      dataIndex: "typeMistake",
      key: "typeMistake",
      width: 200,
      align: "center" as const,
    },
    {
      title: `${t("Actions")}`,
      width: 200,
      align: "center" as const,
    },
  ];
  return (
    <>
      {contextHolder}
      <Title level={3} className="flex justify-center font-semibold my-3">
        {t("Employee in late, out early")}
      </Title>
      <Flex justify="space-between" style={{ marginBottom: 12 }}>
        <Search
          placeholder={t("Search employee")}
          style={{ width: "300px" }}
          value={searchInput}
          onChange={searchChange}
          onSearch={() => handleSearch(searchInput)}
          enterButton
        />
        <DatePicker picker="month" onChange={handleDateChange} placeholder={t("Select month")} />
      </Flex>
      <Table
        dataSource={mistakeRecordSearched}
        columns={columns}
        rowKey="key"
        size="small"
        scroll={{ x: "max-content", y: "calc(100vh - 50px - 48px - 56px - 42px - 39px)" }}
        // full height - header - p/m - title - table header
        pagination={false}
      />
    </>
  );
}
