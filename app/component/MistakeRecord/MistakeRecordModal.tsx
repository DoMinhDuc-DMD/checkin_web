"use client";

import { DMY_FORMAT } from "@/app/constant/ConstantVariables";
import { MistakeTrackRecord } from "@/app/constant/DataType";
import { Modal, Table } from "antd";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

interface MistakeRecordModalProps {
  selectedName: string;
  selectedRecord: MistakeTrackRecord;
  openModal: boolean;
  onClose: () => void;
}

export default function MistakeRecordModal({ selectedName, selectedRecord, openModal, onClose }: MistakeRecordModalProps) {
  const { t } = useTranslation();
  const columns = [
    {
      title: `${t("Date")}`,
      dataIndex: "date",
      key: "date",
      align: "center" as const,
      render: (record: string) => dayjs(record).format(DMY_FORMAT),
    },
    {
      title: `${t("Check in time")}`,
      dataIndex: "checkIn",
      key: "checkIn",
      align: "center" as const,
      render: (record: string) => record?.split(" ")[1],
    },
    {
      title: `${t("Check out time")}`,
      dataIndex: "checkOut",
      key: "checkOut",
      align: "center" as const,
      render: (record: string) => record?.split(", ")[1],
    },
    {
      title: `${t("Type mistake")}`,
      dataIndex: "typeMistake",
      key: "typeMistake",
      align: "center" as const,
    },
  ];

  return (
    <Modal open={openModal} onCancel={onClose} onOk={onClose} title={`${t("Attendance mistake detail of")} ${selectedName}`} width={700}>
      <Table rowKey="date" dataSource={selectedRecord} columns={columns} scroll={{ y: "calc(48.8px * 8)" }} pagination={false} />
    </Modal>
  );
}
