"use client";

import { Col, Form, Modal, Row } from "antd";
import EmployeeListAddInput from "./EmployeeListAddInput";

interface EmployeeListAddModalProps {
  openModal: boolean;
  handleCancel: () => void;
  handleOk: () => void;
}

export default function EmployeeListAddModal({ openModal, handleCancel, handleOk }: EmployeeListAddModalProps) {
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
            <EmployeeListAddInput label="Email" name="employee_email" />
            <EmployeeListAddInput label="Mật khẩu" name="employee_password" />
            <EmployeeListAddInput label="Phòng ban" name="employee_department" />
            <EmployeeListAddInput label="Chức vụ" name="employee_position" />
          </Col>
          <Col span={10} offset={2}>
            <EmployeeListAddInput label="Số điện thoại" name="employee_phone_number" />
            <EmployeeListAddInput label="Ngày sinh" name="employee_birthday" />
            <EmployeeListAddInput label="CCCD/CMND" name="employee_citizen_id" />
            <EmployeeListAddInput label="Tài khoản TCB" name="employee_bank_account" />
            <EmployeeListAddInput label="Biển số xe" name="employee_license_plate" />
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
