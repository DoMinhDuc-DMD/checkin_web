"use client";

import MenuIcon from "@mui/icons-material/Menu";
import Link from "next/link";
import { Avatar, Button, Flex, Image, Layout } from "antd";
import { useState } from "react";
import PersonIcon from "@mui/icons-material/Person";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import BarChartIcon from "@mui/icons-material/BarChart";
import GroupsIcon from "@mui/icons-material/Groups";
import PaidIcon from "@mui/icons-material/Paid";
import SidebarLink from "../component/layout/SidebarLink";
import "@ant-design/v5-patch-for-react-19";
import "../../locales/i18n";
import { useTranslation } from "react-i18next";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const handleToggle = () => setCollapsed(!collapsed);
  const { Header, Content } = Layout;

  const { t, i18n } = useTranslation();
  const handleChangeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <Layout>
      <Flex vertical align="center" gap={40} style={{ width: 200, height: "100vh", position: "fixed" }}>
        <Image alt="Logo" src="/logo/aimesoft-icon.png" preview={false} height={50} />
        <Avatar size={80} icon={<PersonIcon />} />
        <Flex vertical gap={10} style={{ width: 200 }}>
          <SidebarLink link="/main" icon={<AccessTimeIcon />} label={t("Overview")} collapsed={collapsed} />
          <SidebarLink link="/main/Dashboard" icon={<BarChartIcon />} label={t("Dashboard")} collapsed={collapsed} />
          <SidebarLink link="/main/EmployeeList" icon={<GroupsIcon />} label={t("Employees")} collapsed={collapsed} />
          <SidebarLink link="/main/Salary" icon={<PaidIcon />} label={t("Salary")} collapsed={collapsed} />
        </Flex>
      </Flex>
      <Layout
        className={`content fixed h-[100vh] transition-all duration-300 ${
          collapsed ? "w-[calc(100%-42px)] ml-[42px]" : "w-[calc(100%-200px)] ml-[200px]"
        } bg-gray-200`}
      >
        <Header style={{ backgroundColor: "white", padding: "0 20px", height: 50 }} className="flex justify-between items-center">
          <Flex align="center" gap={20}>
            <MenuIcon className="cursor-pointer" onClick={handleToggle} />
            <Link href="/main">
              <span className="text-black text-lg p-2 hover:font-semibold">{t("Home")}</span>
            </Link>
          </Flex>
          <Flex style={{ width: 200 }} justify="space-between">
            <Button style={{ width: 90 }} type={i18n.language === "en" ? "primary" : "default"} onClick={() => handleChangeLanguage("en")}>
              {t("English")}
            </Button>
            <Button style={{ width: 90 }} type={i18n.language === "vi" ? "primary" : "default"} onClick={() => handleChangeLanguage("vi")}>
              {t("Vietnamese")}
            </Button>
          </Flex>
        </Header>
        <Content className="m-3 p-3 bg-white rounded-xl">{children}</Content>
      </Layout>
    </Layout>
  );
}
