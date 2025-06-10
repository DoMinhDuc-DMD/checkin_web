"use client";

import { DMY_FORMAT, MY_FORMAT } from "@/app/constant/ConstantVariables";
import { TrackRecord } from "@/app/constant/DataType";
import { Button, Modal, Table } from "antd";
import dayjs from "dayjs";

interface MistakeModalProps {
  selectedName: string;
  selectedMonth: dayjs.Dayjs;
  selectedRecord: TrackRecord;
  openModal: boolean;
  t: (key: string) => string;
  onClose: () => void;
}

export default function MistakeModal({ selectedName, selectedMonth, selectedRecord, openModal, t, onClose }: MistakeModalProps) {
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
      render: (record: string) => {
        return <span className={`font-semibold ${record !== t("None") ? "text-red-500" : "text-green-600"}`}>{record}</span>;
      },
    },
  ];

  return (
    <Modal
      open={openModal}
      title={`${t("Attendance mistake detail of")} "${selectedName}" ${t("in")} ${t(dayjs(selectedMonth).format(MY_FORMAT))}`}
      width={700}
      onCancel={onClose}
      closeIcon={false}
      footer={
        <Button color="danger" variant="solid" onClick={onClose}>
          {t("Close")}
        </Button>
      }
    >
      <Table rowKey="date" dataSource={selectedRecord} columns={columns} scroll={{ y: "calc(54.8px * 6)" }} pagination={false} />
    </Modal>
  );
}
