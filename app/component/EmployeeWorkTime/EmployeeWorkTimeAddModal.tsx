"use client";

import { Col, Form, Modal, Row } from "antd";
import EmployeeWorkTimeAddInput from "./EmployeeWorkTimeAddInput";
import { useState } from "react";
import { FieldType } from "@/app/main/EmployeeWorkTime/page";
import dayjs from "dayjs";
import { DATE_FORMAT } from "@/app/constant/DateFormatting";
import { useTranslation } from "react-i18next";

interface EmployeeWorkTimeAddModalProps {
  openModal: boolean;
  handleCancel: () => void;
  handleOk: () => void;
}

export default function EmployeeWorkTimeAddModal({ openModal, handleCancel, handleOk }: EmployeeWorkTimeAddModalProps) {
  const { t } = useTranslation();
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

  return (
    <Modal
      title={t("New employee information")}
      style={{ textAlign: "center" }}
      width={800}
      open={openModal}
      onCancel={handleCancel}
      onOk={handleOk}
    >
      <Form layout="vertical">
        <Row>
          <Col span={10} offset={1}>
            <EmployeeWorkTimeAddInput label="Email" name="employee_email" handleInputChange={handleInputChange} />
            <EmployeeWorkTimeAddInput label={t("Password")} name="employee_password" handleInputChange={handleInputChange} />
            <EmployeeWorkTimeAddInput label={t("Department")} name="employee_department" handleSelectChange={handleSelectChange} />
            <EmployeeWorkTimeAddInput label={t("Position")} name="employee_position" handleSelectChange={handleSelectChange} />
          </Col>
          <Col span={10} offset={2}>
            <EmployeeWorkTimeAddInput
              label={t("Phone number")}
              name="employee_phone_number"
              maxLength={10}
              value={formData.employee_phone_number}
              handleNumberOnly={handleNumberOnly}
            />
            <EmployeeWorkTimeAddInput label={t("Birthday")} name="employee_birthday" handleDateChange={handleDateChange} />
            <EmployeeWorkTimeAddInput
              label={t("Citizen id")}
              name="employee_citizen_id"
              maxLength={12}
              value={formData.employee_citizen_id}
              handleNumberOnly={handleNumberOnly}
            />
            <EmployeeWorkTimeAddInput
              label={t("Techcombank account")}
              name="employee_bank_account"
              maxLength={14}
              value={formData.employee_bank_account}
              handleNumberOnly={handleNumberOnly}
            />
            <EmployeeWorkTimeAddInput label={t("License plate")} name="employee_license_plate" handleInputChange={handleInputChange} />
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
