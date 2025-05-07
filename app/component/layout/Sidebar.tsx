"use client";

import { Avatar, Flex, Image } from "antd";
import PersonIcon from "@mui/icons-material/Person";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import BarChartIcon from "@mui/icons-material/BarChart";
import GroupsIcon from "@mui/icons-material/Groups";
import PaidIcon from "@mui/icons-material/Paid";
// import NotificationsIcon from "@mui/icons-material/Notifications";
// import SettingsIcon from "@mui/icons-material/Settings";
import SidebarLink from "./SidebarLink";

export default function Sidebar() {
  return (
    <Flex vertical align="center" gap={40} style={{ width: 200, height: "100vh", position: "fixed" }}>
      <Image alt="Logo" src="/logo/aimesoft-icon.png" preview={false} height={50} />
      <Avatar size={80} icon={<PersonIcon />} />
      <Flex vertical gap={10} style={{ width: 200 }}>
        <SidebarLink link="/main" icon={<AccessTimeIcon />} label="Tổng quan" />
        <SidebarLink link="/main/Dashboard" icon={<BarChartIcon />} label="Thống kê" />
        <SidebarLink link="/main/EmployeeList" icon={<GroupsIcon />} label="Nhân viên" />
        <SidebarLink link="/main/Salary" icon={<PaidIcon />} label="Bảng lương" />
        {/* <SidebarLink link="/main/Notification" icon={<NotificationsIcon />} label="Thông báo" /> */}
        {/* <SidebarLink link="/main/Setting" icon={<SettingsIcon />} label="Cài đặt" /> */}
      </Flex>
    </Flex>
  );
}
