"use client";

import { FieldType } from "@/app/main/EmployeeList/page";
import { DatePicker, Form, Input, Select } from "antd";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  const departmentOptions = [
    { value: "Aimesoft", label: "Aimesoft" },
    { value: "Vikoisoft", label: "Vikoisoft" },
  ];

  const positionOptions = [
    { value: "Leader", label: "Leader" },
    { value: "Developer", label: "Developer" },
    { value: "Tester", label: "Tester" },
  ];

  const rules = [
    { required: true, message: t("This filed cannot be empty!") },
    ...(name === "employee_phone_number" || name === "employee_citizen_id" || name === "employee_bank_account"
      ? [
          {
            pattern: /^[0-9]+$/,
            message: t("This field must be contain number only!"),
          },
        ]
      : []),
  ];

  const renderInput = () => {
    if (name === "employee_password") {
      return <Input.Password name={name} value={value} onChange={handleInputChange} />;
    }

    if (name === "employee_department") {
      return <Select options={departmentOptions} onChange={(val) => handleSelectChange?.(val, name)} />;
    }

    if (name === "employee_position") {
      return <Select options={positionOptions} onChange={(val) => handleSelectChange?.(val, name)} />;
    }

    if (name === "employee_birthday") {
      return <DatePicker className="w-full" onChange={handleDateChange} />;
    }

    if (name === "employee_bank_account" || name === "employee_citizen_id" || name === "employee_phone_number") {
      return <Input name={name} value={value} maxLength={maxLength} onChange={handleNumberOnly} />;
    }

    return <Input name={name} value={value} maxLength={maxLength} onChange={handleInputChange} />;
  };

  return (
    <Form.Item<FieldType> label={label} name={name} rules={rules}>
      {renderInput()}
    </Form.Item>
  );
}
