"use client";

import PersonIcon from "@mui/icons-material/Person";
import { Avatar, Button, DatePicker, Input } from "antd";
import "@ant-design/v5-patch-for-react-19";
import { ChangeEvent, useState } from "react";
import dayjs from "dayjs";

export default function Setting() {
  const [formData, setFormData] = useState({
    employee_phone_number: "",
    employee_birthday: "",
    employee_citizen_id: "",
    employee_bank_account: "",
    employee_personal_email: "",
    employee_license_plate: "",
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const onlyNumbers = value.replace(/[^0-9]/g, "");
    setFormData((prev) => ({ ...prev, [name]: onlyNumbers }));
  };

  const handleDateChange = (date: dayjs.Dayjs) => {
    setFormData((prev) => ({
      ...prev,
      employee_birthday: date ? date.format("YYYY-MM-DD") : "",
    }));
  };

  return (
    <>
      <div className="flex justify-center text-2xl font-semibold my-3">Cài đặt tài khoản</div>
      <div className="h-[90%] text-center bg-blue-200 rounded-xl">
        <Avatar size={120} icon={<PersonIcon />} />
        <div className="flex flex-col-2 justify-center gap-x-10 my-5">
          <div className="w-[30%] flex flex-col gap-y-5">
            <Input name="employee_code" placeholder="Mã nhân viên" readOnly />
            <Input name="employee_name" placeholder="Tên nhân viên" readOnly />
            <Input name="employee_department" placeholder="Phòng ban" readOnly />
            <Input name="employee_role" placeholder="Chức vụ" readOnly />
            <Input name="employee_company_email" placeholder="Email công ty" readOnly />
          </div>
          <div className="w-[30%] flex flex-col gap-y-5">
            <Input
              name="employee_phone_number"
              placeholder="Số điện thoại"
              maxLength={10}
              value={formData.employee_phone_number}
              onChange={handleInputNumberChange}
            />
            <DatePicker
              name="employee_birthday"
              placeholder="Ngày sinh"
              value={formData?.employee_birthday ? dayjs(formData.employee_birthday) : null}
              onChange={handleDateChange}
            />
            <Input
              name="employee_citizen_id"
              placeholder="CCCD/CMND"
              maxLength={12}
              value={formData.employee_citizen_id}
              onChange={handleInputNumberChange}
            />
            <Input
              name="employee_bank_account"
              placeholder="Số tài khoản TCB"
              value={formData.employee_bank_account}
              onChange={handleInputNumberChange}
            />
            <Input
              name="employee_personal_email"
              placeholder="Email cá nhân"
              value={formData.employee_personal_email}
              onChange={handleInputChange}
            />
            <Input
              name="employee_license_plate"
              placeholder="Biển số xe"
              maxLength={12}
              value={formData.employee_license_plate}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div>
          <Button color="cyan" variant="solid">
            Cập nhật
          </Button>
          <Button type="primary" danger>
            Đăng xuất
          </Button>
        </div>
      </div>
    </>
  );
}
