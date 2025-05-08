"use client";

import { Col, Form, Modal, Row } from "antd";
import EmployeeListAddInput from "./EmployeeListAddInput";
import { useState } from "react";
import { FieldType } from "@/app/main/EmployeeList/page";
import dayjs from "dayjs";
import { DATE_FORMAT } from "@/app/constant/DateFormatting";

interface EmployeeListAddModalProps {
  openModal: boolean;
  handleCancel: () => void;
  handleOk: () => void;
}

export default function EmployeeListAddModal({ openModal, handleCancel, handleOk }: EmployeeListAddModalProps) {
  const [formData, setFormData] = useState<FieldType>({
    employee_email: "",
    employee_password: "",
    employee_department: "",
    employee_position: "",
    employee_phone_number: "",
    employee_birthday: "",
    employee_citizen_id: "",
    employee_bank_account: "",
    employee_license_plate: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (value: string, name: keyof FieldType) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (date: dayjs.Dayjs) => {
    setFormData((prev) => ({
      ...prev,
      employee_birthday: date ? date.format(DATE_FORMAT) : "",
    }));
  };

  const handleNumberOnly = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;

    const onlyNumbers = value.replace(/[^0-9]/g, "");
    setFormData((prev) => ({
      ...prev,
      [name]: onlyNumbers,
    }));
  };

  console.log(formData);

  return (
    <Modal
      title="Thông tin nhân viên mới"
      style={{ textAlign: "center" }}
      width={800}
      open={openModal}
      onCancel={handleCancel}
      onOk={handleOk}
    >
      <Form layout="vertical">
        <Row>
          <Col span={10} offset={1}>
            <EmployeeListAddInput label="Email" name="employee_email" handleInputChange={handleInputChange} />
            <EmployeeListAddInput label="Mật khẩu" name="employee_password" handleInputChange={handleInputChange} />
            <EmployeeListAddInput label="Phòng ban" name="employee_department" handleSelectChange={handleSelectChange} />
            <EmployeeListAddInput label="Chức vụ" name="employee_position" handleSelectChange={handleSelectChange} />
          </Col>
          <Col span={10} offset={2}>
            <EmployeeListAddInput
              label="Số điện thoại"
              name="employee_phone_number"
              maxLength={10}
              value={formData.employee_phone_number}
              handleNumberOnly={handleNumberOnly}
            />
            <EmployeeListAddInput label="Ngày sinh" name="employee_birthday" handleDateChange={handleDateChange} />
            <EmployeeListAddInput
              label="CCCD/CMND"
              name="employee_citizen_id"
              maxLength={12}
              value={formData.employee_citizen_id}
              handleNumberOnly={handleNumberOnly}
            />
            <EmployeeListAddInput
              label="Tài khoản TCB"
              name="employee_bank_account"
              maxLength={14}
              value={formData.employee_bank_account}
              handleNumberOnly={handleNumberOnly}
            />
            <EmployeeListAddInput label="Biển số xe" name="employee_license_plate" handleInputChange={handleInputChange} />
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
