"use client";

import MenuIcon from "@mui/icons-material/Menu";
import { Avatar, Button, Flex, Image, Layout } from "antd";
import { useState } from "react";
import PersonIcon from "@mui/icons-material/Person";
import BarChartIcon from "@mui/icons-material/BarChart";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

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
          <SidebarLink link="/main" icon={<BarChartIcon />} label={t("Dashboard")} collapsed={collapsed} />
          <SidebarLink link="/main/EmployeeWorkTime" icon={<AccessTimeOutlinedIcon />} label={t("Working time")} collapsed={collapsed} />
          <SidebarLink link="/main/Attendance" icon={<CheckCircleOutlinedIcon />} label={t("Attendance")} collapsed={collapsed} />
          <SidebarLink link="/main/InLate-OutEarly" icon={<CancelOutlinedIcon />} label={t("In late/Out early")} collapsed={collapsed} />
          {/* <SidebarLink link="/main/Notification" icon={<CancelOutlinedIcon />} label={t("Noti")} collapsed={collapsed} /> */}
        </Flex>
      </Flex>
      <Layout
        className={`content fixed h-[100vh] transition-all duration-300 ${
          collapsed ? "w-[calc(100%-42px)] ml-[42px]" : "w-[calc(100%-200px)] ml-[200px]"
        } bg-gray-200`}
      >
        <Header style={{ backgroundColor: "white", padding: "0 20px", height: 50 }} className="flex justify-between items-center">
          <MenuIcon className="cursor-pointer" onClick={handleToggle} />
          <Flex style={{ width: 200 }} justify="space-between">
            <Button style={{ width: 90 }} type={i18n.language === "vi" ? "primary" : "default"} onClick={() => handleChangeLanguage("vi")}>
              {t("Vietnamese")}
            </Button>
            <Button style={{ width: 90 }} type={i18n.language === "en" ? "primary" : "default"} onClick={() => handleChangeLanguage("en")}>
              {t("English")}
            </Button>
          </Flex>
        </Header>
        <Content className="m-3 p-3 bg-white rounded-xl">{children}</Content>
      </Layout>
    </Layout>
  );
}
