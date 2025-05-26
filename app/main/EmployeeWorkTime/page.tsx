"use client";

import { Flex, Typography } from "antd";
import Search from "antd/es/input/Search";
import { useEffect, useState } from "react";
import "@ant-design/v5-patch-for-react-19";
import EmployeeWorkTimeTable from "@/app/component/EmployeeWorkTime/EmployeeWorkTimeTable";
import { useCustomNotification } from "@/app/hooks/UseCustomNotification";
import { useTranslation } from "react-i18next";
import { User } from "@/app/constant/DataType";
import axios from "axios";

export default function EmployeeWorkTime() {
  const { t } = useTranslation();
  const [originalUser, setOriginalUser] = useState<User[]>([]);
  const [user, setUser] = useState<User[]>([]);

  const [searchInput, setSearchInput] = useState("");
  const { openNotification, contextHolder } = useCustomNotification();

  useEffect(() => {
    try {
      const fetchUser = async () => {
        const res = await axios.get("http://192.168.1.80:4455/api/v1/users/?limit=20");
        setOriginalUser(res.data.data);
        setUser(res.data.data);
      };
      fetchUser();
    } catch (error) {
      console.error(error);
    }
  }, []);

  console.log(user);

  const searchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleSearch = (value: string) => {
    setSearchInput(value);
    if (!value) {
      setUser(originalUser);
      return;
    }
    const searchTerm = value.toLowerCase();
    const filteredData = originalUser.filter(
      (data) => data.displayName.toLowerCase().includes(searchTerm) || data.role.toLowerCase().includes(searchTerm)
    );
    if (filteredData.length === 0) {
      openNotification(t("Notice"), t("No suitable employee found!"));
      return;
    }
    setUser(filteredData);
  };

  return (
    <>
      {contextHolder}
      <Typography.Title level={3} className="flex justify-center font-semibold my-3">
        {t("Employee working time")}
      </Typography.Title>
      <Flex justify="space-between">
        <Search
          placeholder={t("Search employee")}
          style={{ width: "300px", marginBottom: 12 }}
          value={searchInput}
          onChange={searchChange}
          onSearch={() => handleSearch(searchInput)}
          enterButton
        />
      </Flex>
      <EmployeeWorkTimeTable user={user} />
    </>
  );
}
