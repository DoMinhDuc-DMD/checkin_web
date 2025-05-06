"use client";

import { EmployeeTypeData } from "@/app/constant/DataType";
import { Modal } from "antd";

export default function EmployeeListModal(record: EmployeeTypeData) {
  Modal.info({
    title: `Chi tiết nhân viên ${record.employee_name}`,
    width: 700,
    content: (
      <div className="grid grid-cols-2">
        <div>
          <p>Mã nhân viên: {record.employee_code}</p>
          <p>Họ và tên: {record.employee_name}</p>
          <p>Phòng ban: {record.employee_department}</p>
          <p>Vị trí: {record.employee_position}</p>
          <p>Email công ty: {record.employee_email}</p>
        </div>
        <div>
          <p>Số điện thoại: </p>
          <p>Ngày sinh: </p>
          <p>Giới tính: </p>
          <p>CCCD/CMND: </p>
          <p>Tài khoản TCB: </p>
          <p>Biến số xe: </p>
        </div>
      </div>
    ),
    onOk() {},
  });
}
