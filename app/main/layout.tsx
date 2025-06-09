"use client";

import { Avatar, Button, Flex, Image, Layout } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "../../locales/i18n";
import "@ant-design/v5-patch-for-react-19";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import BarChartIcon from "@mui/icons-material/BarChart";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import SidebarLink from "../component/SidebarLink";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const handleToggle = () => setCollapsed(!collapsed);
  const { Header, Content } = Layout;

  const { t, i18n } = useTranslation();
  const handleChangeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("currentLang", lang);
  };

  useEffect(() => {
    const savedLang = localStorage.getItem("currentLang");
    if (savedLang && savedLang !== i18n.language) {
      i18n.changeLanguage(savedLang);
    }

    const handleResize = () => {
      if (window.innerWidth <= 1024) setCollapsed(true);
      else setCollapsed(false);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Layout>
      <Flex vertical align="center" gap={40} style={{ width: 200, height: "100vh", position: "fixed" }}>
        <Image alt="Logo" src="/logo/aimesoft-icon.png" preview={false} height={50} />
        <Avatar size={80} icon={<PersonIcon />} />
        <Flex vertical gap={10} style={{ width: 200 }}>
          <SidebarLink link="/main" icon={<BarChartIcon />} label={t("Dashboard")} collapsed={collapsed} />
          <SidebarLink link="/main/Attendance" icon={<EventAvailableIcon />} label={t("Attendance")} collapsed={collapsed} />
          <SidebarLink link="/main/Mistake" icon={<EventBusyIcon />} label={t("In late/out early")} collapsed={collapsed} />
        </Flex>
      </Flex>
      <Layout
        className={`content fixed h-[100vh] overflow-y-auto transition-all duration-300 ${
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
        <Content className="m-3 h-[100%]">{children}</Content>
      </Layout>
    </Layout>
  );
}
