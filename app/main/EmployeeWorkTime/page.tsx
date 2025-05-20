"use client";

import { dataSource } from "@/app/TestData/data";
import { Flex, Typography } from "antd";
import Search from "antd/es/input/Search";
import { useState } from "react";
import "@ant-design/v5-patch-for-react-19";
import EmployeeWorkTimeTable from "@/app/component/EmployeeWorkTime/EmployeeWorkTimeTable";
import EmployeeWorkTimeAddModal from "@/app/component/EmployeeWorkTime/EmployeeWorkTimeAddModal";
import { useCustomNotification } from "@/app/hooks/UseCustomNotification";
import { useTranslation } from "react-i18next";

export type FieldType = {
  employee_email?: string;
  employee_password?: string;
  employee_department?: string;
  employee_position?: string;
  employee_phone_number?: string;
  employee_birthday?: string;
  employee_citizen_id?: string;
  employee_bank_account?: string;
  employee_license_plate?: string;
};

export default function EmployeeWorkTime() {
  const { t } = useTranslation();
  const [data, setData] = useState(dataSource);
  const [searchInput, setSearchInput] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const { openNotification, contextHolder } = useCustomNotification();

  const { Title } = Typography;

  const searchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleSearch = (value: string) => {
    setSearchInput(value);
    if (!value) {
      setData(dataSource);
      return;
    }
    const searchTerm = value.toLowerCase();
    const filteredData = dataSource.filter((data) => data.employee_name.toLowerCase().includes(searchTerm));
    if (filteredData.length === 0) {
      openNotification(t("Notice"), t("No suitable employee found!"));
      return;
    }
    setData(filteredData);
  };

  // const handleOpenModal = () => {
  //   setOpenModal(true);
  // };
  const handleCancel = () => {
    setOpenModal(false);
  };
  const handleOk = () => {
    setOpenModal(false);
  };

  return (
    <>
      {contextHolder}
      <Title level={3} className="flex justify-center font-semibold my-3">
        {t("Employee working time")}
      </Title>
      <Flex justify="space-between">
        <Search
          placeholder={t("Search employee")}
          style={{ width: "300px", marginBottom: 12 }}
          value={searchInput}
          onChange={searchChange}
          onSearch={() => handleSearch(searchInput)}
          enterButton
        />
        {/* <Button type="primary" onClick={handleOpenModal}>
          {t("New employee")}
        </Button> */}
      </Flex>
      <EmployeeWorkTimeAddModal openModal={openModal} handleCancel={handleCancel} handleOk={handleOk} />
      <EmployeeWorkTimeTable data={data} />
    </>
  );
}
