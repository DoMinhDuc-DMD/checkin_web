"use client";

import { User } from "@/app/constant/DataType";
import { Col, Modal, Row, Space, Typography } from "antd";
import { useTranslation } from "react-i18next";

interface EmployeeWorkTimeDetailModalProps {
  openModal: boolean;
  record: User | null;
  onCancel: () => void;
  onOk: () => void;
}

export default function EmployeeWorkTimeDetailModal({ openModal, record, onCancel, onOk }: EmployeeWorkTimeDetailModalProps) {
  const { t } = useTranslation();
  const { Text } = Typography;

  return (
    <Modal width={700} title={`${t("Information of ")} ${record?.displayName}`} open={openModal} onCancel={onCancel} onOk={onOk}>
      <Row>
        <Col span={10} offset={1}>
          <Space direction="vertical">
            <Text>
              {t("Code")}: {record?._id}
            </Text>
            <Text>Email: {record?.email}</Text>
            <Text>
              {t("Role")}: {record?.role.toLocaleUpperCase()}
            </Text>
          </Space>
        </Col>
        <Col span={10} offset={2}>
          <Space direction="vertical">
            <Text>{t("Worked date")}: </Text>
            <Text>{t("Worked hours")}: </Text>
            <Text>{t("Overtime hours")}: </Text>
          </Space>
        </Col>
      </Row>
    </Modal>
  );
}
