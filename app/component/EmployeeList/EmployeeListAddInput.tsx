"use client";

import { FieldType } from "@/app/main/EmployeeList/page";
import { DatePicker, Form, Input, Select } from "antd";
import dayjs from "dayjs";

interface EmployeeListAddInputProps {
  label: string;
  name: keyof FieldType;
  value?: string;
  maxLength?: number;
  handleInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange?: (value: string, name: keyof FieldType) => void;
  handleDateChange?: (e: dayjs.Dayjs) => void;
  handleNumberOnly?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function EmployeeListAddInput({
  label,
  name,
  value,
  maxLength,
  handleInputChange,
  handleSelectChange,
  handleDateChange,
  handleNumberOnly,
}: EmployeeListAddInputProps) {
  const departmentOptions = [
    {
      value: "Aimesoft",
      label: "Aimesoft",
    },
    {
      value: "Vikoisoft",
      label: "Vikoisoft",
    },
  ];
  const positionOptions = [
    {
      value: "Leader",
      label: "Leader",
    },
    {
      value: "Developer",
      label: "Developer",
    },
    {
      value: "Tester",
      label: "Tester",
    },
  ];
  const renderInput = () => {
    if (name === "employee_password") {
      return <Input.Password name={name} onChange={handleInputChange} />;
    } else if (name === "employee_department") {
      return <Select options={departmentOptions} onChange={(val) => handleSelectChange?.(val, name)} />;
    } else if (name === "employee_position") {
      return <Select options={positionOptions} onChange={(val) => handleSelectChange?.(val, name)} />;
    } else if (name === "employee_birthday") {
      return <DatePicker name={name} className="w-full" onChange={handleDateChange} />;
    } else if (name === "employee_bank_account" || name === "employee_citizen_id" || name === "employee_phone_number")
      return <Input name={name} value={value} maxLength={maxLength} onChange={handleNumberOnly} />;

    return <Input name={name} onChange={handleInputChange} />;
  };
  return (
    <Form.Item<FieldType> label={label} rules={[{ required: true, message: "Không được để trống!" }]}>
      {renderInput()}
    </Form.Item>
  );
}
