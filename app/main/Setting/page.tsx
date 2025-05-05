"use client";

import PersonIcon from "@mui/icons-material/Person";
import { Avatar, Button, DatePicker, Input } from "antd";
import "@ant-design/v5-patch-for-react-19";
import { ChangeEvent, useState } from "react";
import dayjs from "dayjs";

export default function Setting() {
  const [formData, setFormData] = useState({
    phone_number: "",
    birthday: "",
    citizen_id: "",
    bank_account: "",
    personal_email: "",
    license_plate: "",
  });

  const handleInputNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const onlyNumbers = value.replace(/[^0-9]/g, "");
    setFormData((prev) => ({ ...prev, [name]: onlyNumbers }));
  };

  const handleDateChange = (date: dayjs.Dayjs) => {
    setFormData((prev) => ({
      ...prev,
      birthday: date ? date.format("YYYY-MM-DD") : "",
    }));
  };

  return (
    <>
      <div className="flex justify-center text-2xl font-semibold my-3">Cài đặt tài khoản</div>
      <div className="h-[90%] text-center rounded-xl">
        <Avatar size={120} icon={<PersonIcon />} />
        <div className="flex flex-col-2 justify-center gap-x-10 my-5">
          <div className="w-[30%] flex flex-col gap-y-5">
            <Input name="name" placeholder="Họ và tên" readOnly />
            <Input name="department" placeholder="Phòng ban" readOnly />
            <Input name="role" placeholder="Chức vụ" readOnly />
            <Input name="company_email" placeholder="Email công ty" readOnly />
          </div>
          <div className="w-[30%] flex flex-col gap-y-5">
            <Input
              name="phone_number"
              placeholder="Số điện thoại"
              maxLength={10}
              value={formData.phone_number}
              onChange={handleInputNumberChange}
            />
            <DatePicker
              name="birthday"
              placeholder="Ngày sinh"
              value={formData?.birthday ? dayjs(formData.birthday) : null}
              onChange={handleDateChange}
            />
            <Input
              name="citizen_id"
              placeholder="CCCD/CMND"
              maxLength={12}
              value={formData.citizen_id}
              onChange={handleInputNumberChange}
            />
            <Input name="bank_account" placeholder="Số tài khoản TCB" value={formData.bank_account} onChange={handleInputNumberChange} />
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
