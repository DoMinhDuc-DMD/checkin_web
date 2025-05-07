"use client";

import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "../component/layout/Sidebar";
import Link from "next/link";
import { Layout } from "antd";
import { useState } from "react";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const handleToggle = () => setCollapsed(!collapsed);
  const { Header, Content } = Layout;

  return (
    <Layout>
      <Sidebar />
      <Layout
        className={`content fixed h-[100vh] transition-all duration-300 ${
          collapsed ? "w-full ml-0" : "w-[calc(100%-200px)] ml-[200px]"
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
