"use client";

import { EmployeeTypeData } from "@/app/constant/DataType";
import { Col, Modal, Row, Space, Typography } from "antd";
import { useTranslation } from "react-i18next";

interface EmployeeListDetailModalProps {
  openModal: boolean;
  record: EmployeeTypeData | null;
  onCancel: () => void;
  onOk: () => void;
}

export default function EmployeeListDetailModal({ openModal, record, onCancel, onOk }: EmployeeListDetailModalProps) {
  const { t } = useTranslation();
  const { Text } = Typography;

  return (
    <Modal width={700} title={`${t("Information of ")} ${record?.employee_name}`} open={openModal} onCancel={onCancel} onOk={onOk}>
      <Row>
        <Col span={10} offset={1}>
          <Space direction="vertical">
            <Text>
              {t("Code")}: {record?.employee_code}
            </Text>
            <Text>
              {t("Name")}: {record?.employee_name}
            </Text>
            <Text>
              {t("Department")}: {record?.employee_department}
            </Text>
            <Text>
              {t("Position")}: {record?.employee_position}
            </Text>
            <Text>Email: {record?.employee_email}</Text>
          </Space>
        </Col>
        <Col span={10} offset={2}>
          <Space direction="vertical">
            <Text>{t("Phone number")}: </Text>
            <Text>{t("Birthday")}: </Text>
            <Text>{t("Citizen id")}: </Text>
            <Text>{t("Techcombank account")}: </Text>
            <Text>{t("License plate")}: </Text>
          </Space>
        </Col>
      </Row>
    </Modal>
  );
}
