"use client";

import MenuIcon from "@mui/icons-material/Menu";
// import Sidebar from "../component/layout/Sidebar";
import Link from "next/link";
import { Avatar, Flex, Image, Layout } from "antd";
import { useState } from "react";
import PersonIcon from "@mui/icons-material/Person";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import BarChartIcon from "@mui/icons-material/BarChart";
import GroupsIcon from "@mui/icons-material/Groups";
import PaidIcon from "@mui/icons-material/Paid";
import SidebarLink from "../component/layout/SidebarLink";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const handleToggle = () => setCollapsed(!collapsed);
  const { Header, Content } = Layout;

  return (
    <Layout>
      <Flex vertical align="center" gap={40} style={{ width: 200, height: "100vh", position: "fixed" }}>
        <Image alt="Logo" src="/logo/aimesoft-icon.png" preview={false} height={50} />
        <Avatar size={80} icon={<PersonIcon />} />
        <Flex vertical gap={10} style={{ width: 200 }}>
          <SidebarLink link="/main" icon={<AccessTimeIcon />} label="Tổng quan" collapsed={collapsed} />
          <SidebarLink link="/main/Dashboard" icon={<BarChartIcon />} label="Thống kê" collapsed={collapsed} />
          <SidebarLink link="/main/EmployeeList" icon={<GroupsIcon />} label="Nhân viên" collapsed={collapsed} />
          <SidebarLink link="/main/Salary" icon={<PaidIcon />} label="Bảng lương" collapsed={collapsed} />
        </Flex>
      </Flex>
      <Layout
        className={`content fixed h-[100vh] transition-all duration-300 ${
          collapsed ? "w-[calc(100%-42px)] ml-[42px]" : "w-[calc(100%-200px)] ml-[200px]"
        } bg-gray-200`}
      >
        <Header style={{ backgroundColor: "white", paddingLeft: 20, height: 50 }} className="flex items-center gap-5">
          <MenuIcon className="cursor-pointer" onClick={handleToggle} />
          <Link href="/main">
            <span className="text-black text-lg p-2 hover:font-semibold">Trang chủ</span>
          </Link>
        </Header>
        <Content className="m-3 p-3 bg-white rounded-xl">{children}</Content>
      </Layout>
    </Layout>
  );
}
