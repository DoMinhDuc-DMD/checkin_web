"use client";

import { dataSource } from "@/app/TestData/Approval/data";
import { Button, Table } from "antd";
import Search from "antd/es/input/Search";

export default function Approval() {
  const columns = [
    {
      title: "STT",
      key: "id",
      align: "center" as const,
      width: "3%",
      render: (_: unknown, __: unknown, index: number) => index + 1,
    },
    {
      title: "Mã NV",
      dataIndex: "employee_code",
      key: "employee_code",
      width: "7%",
      align: "center" as const,
    },
    {
      title: "Họ và tên",
      dataIndex: "employee_name",
      key: "employee_name",
      width: "15%",
      align: "center" as const,
    },
    {
      title: "Phòng ban",
      dataIndex: "employee_department",
      key: "employee_department",
      width: "15%",
      align: "center" as const,
    },

    {
      title: "Vị trí",
      dataIndex: "employee_position",
      key: "employee_position",
      width: "15%",
      align: "center" as const,
    },
    {
      title: "Loại yêu cầu",
      dataIndex: "request_type",
      key: "request_type",
      width: "15%",
      align: "center" as const,
    },
    {
      title: "Lý do",
      dataIndex: "request_note",
      key: "request_note",
      width: "15%",
      align: "center" as const,
    },
    {
      title: "Hành động",
      width: "15%",
      align: "center" as const,
      render: () => (
        <div className="flex gap-x-2 justify-center">
          <Button type="primary">Phê duyệt</Button>
          <Button type="primary">Bác bỏ</Button>
        </div>
      ),
    },
  ];
  return (
    <>
      <div className="flex justify-center text-2xl font-semibold my-3">Phê duyệt yêu cầu</div>
      <div className="flex flex-col">
        <Search placeholder="Tìm kiếm nhân viên" style={{ width: "20%", marginBottom: 12 }} enterButton />
        <Table columns={columns} dataSource={dataSource} pagination={false} />
      </div>
    </>
  );
}
