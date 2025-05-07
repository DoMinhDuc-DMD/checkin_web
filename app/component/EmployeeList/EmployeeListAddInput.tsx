"use client";

import { FieldType } from "@/app/main/EmployeeList/page";
import { DatePicker, Form, Input, Select } from "antd";

interface EmployeeListAddInputProps {
  label: string;
  name: keyof FieldType;
}

export default function EmployeeListAddInput({ label, name }: EmployeeListAddInputProps) {
  const renderInput = () => {
    if (name === "employee_password") {
      return <Input.Password />;
    }

    if (name === "employee_department") {
      return (
        <Select>
          <Select.Option value="Aimesoft">Aimesoft</Select.Option>
          <Select.Option value="Vikoisoft">Vikoisoft</Select.Option>
        </Select>
      );
    }

    if (name === "employee_position") {
      return (
        <Select>
          <Select.Option value="Leader">Leader</Select.Option>
          <Select.Option value="Developer">Developer</Select.Option>
          <Select.Option value="Tester">Tester</Select.Option>
        </Select>
      );
    }

    if (name === "employee_birthday") {
      return <DatePicker className="w-full" />;
    }

    return <Input />;
  };
  return (
    <Form.Item<FieldType> label={label} name={name} rules={[{ required: true, message: "Không được để trống!" }]}>
      {renderInput()}
    </Form.Item>
  );
}
