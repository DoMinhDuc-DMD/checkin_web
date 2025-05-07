"use client";

import { dataSource } from "@/app/TestData/data";
import { Button, Flex, notification, Typography } from "antd";
import Search from "antd/es/input/Search";
import { useState } from "react";
import "@ant-design/v5-patch-for-react-19";
import EmployeeListTable from "@/app/component/EmployeeList/EmployeeListTable";
import EmployeeListAddModal from "@/app/component/EmployeeList/EmployeeListAddModal";

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

export default function EmployeeList() {
  const [data, setData] = useState(dataSource);
  const [searchInput, setSearchInput] = useState("");
  const [api, contextHolder] = notification.useNotification();
  const [openModal, setOpenModal] = useState(false);

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
      openNotification();
      return;
    }
    setData(filteredData);
  };

  const openNotification = () => {
    api.info({
      message: "Thông báo",
      description: "Không tìm thấy nhân viên phù hợp",
      placement: "topRight",
      duration: 2,
      style: {
        width: 400,
        borderRadius: 10,
      },
    });
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };
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
        Danh sách nhân viên
      </Title>
      <Flex justify="space-between">
        <Search
          placeholder="Tìm kiếm nhân viên"
          style={{ width: "300px", marginBottom: 12 }}
          value={searchInput}
          onChange={searchChange}
          onSearch={() => handleSearch(searchInput)}
          enterButton
        />
        <Button type="primary" onClick={handleOpenModal}>
          Thêm nhân viên
        </Button>
      </Flex>
      <EmployeeListAddModal openModal={openModal} handleCancel={handleCancel} handleOk={handleOk} />
      <EmployeeListTable data={data} />
    </>
  );
}
