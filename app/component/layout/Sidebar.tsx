"use client";

import { Avatar, Image } from "antd";
import Link from "next/link";
import PersonIcon from "@mui/icons-material/Person";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import BarChartIcon from "@mui/icons-material/BarChart";
import GroupsIcon from "@mui/icons-material/Groups";
import PaidIcon from "@mui/icons-material/Paid";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import SidebarLink from "./SidebarLink";

export default function Sidebar() {
  return (
    <div className="w-[200px] h-[100vh] pt-5 flex flex-col fixed gap-y-10 items-center bg-white">
      <Link href="/main">
        <Image alt="Logo" src="/logo/aimesoft-icon.png" preview={false} width={150} />
      </Link>
      <Avatar size={80} icon={<PersonIcon />} />
      <div className="flex flex-col w-full gap-y-2">
        <SidebarLink link="/main" icon={<AccessTimeIcon />} label="Chấm công" />
        <SidebarLink link="/main/EmployeeList" icon={<GroupsIcon />} label="Nhân viên" />
        <SidebarLink link="/main/Dashboard" icon={<BarChartIcon />} label="Thống kê" />
        <SidebarLink link="/main/Salary" icon={<PaidIcon />} label="Bảng lương" />
        <SidebarLink link="/main/Notification" icon={<NotificationsIcon />} label="Thông báo" />
        <SidebarLink link="/main/Setting" icon={<SettingsIcon />} label="Cài đặt" />
      </div>
    </div>
  );
}
