"use client";

import { EmployeeTypeData } from "@/app/constant/DataType";
import { Col, Modal, Row, Space, Typography } from "antd";

export default function EmployeeListDetailModal(record: EmployeeTypeData) {
  const { Text } = Typography;
  Modal.info({
    title: `Chi tiết nhân viên ${record.employee_name}`,
    width: 700,
    content: (
      <>
        <Row>
          <Col span={10}>
            <Space direction="vertical">
              <Text>Mã nhân viên: {record.employee_code}</Text>
              <Text>Họ và tên: {record.employee_name}</Text>
              <Text>Phòng ban: {record.employee_department}</Text>
              <Text>Vị trí: {record.employee_position}</Text>
              <Text>Email công ty: {record.employee_email}</Text>
            </Space>
          </Col>
          <Col span={10} offset={2}>
            <Space direction="vertical">
              <Text>Số điện thoại: </Text>
              <Text>Ngày sinh: </Text>
              <Text>CCCD/CMND: </Text>
              <Text>Tài khoản TCB: </Text>
              <Text>Biến số xe: </Text>
            </Space>
          </Col>
        </Row>
      </>
    ),
    onOk() {},
  });
}
