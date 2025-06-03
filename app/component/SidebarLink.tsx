"use client";

import { Tooltip } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactElement } from "react";

export default function SidebarLink({
  link,
  icon,
  label,
  exact = true,
  collapsed,
}: {
  link: string;
  icon: ReactElement;
  label: string;
  exact?: boolean;
  collapsed: boolean;
}) {
  const pathName = usePathname();
  const isActive = exact ? pathName === link : pathName.startsWith(link);

  return (
    <Link href={link}>
      <span
        className={`text-black flex gap-x-5 py-3 hover:bg-blue-200 hover:rounded-r-4xl hover:font-semibold transition-all duration-200
          ${isActive ? "bg-blue-200 rounded-r-4xl font-semibold" : ""} ${collapsed ? "px-2" : "px-6"}`}
      >
        {collapsed ? (
          <Tooltip title={label} placement="right">
            {icon}
          </Tooltip>
        ) : (
          icon
        )}
        {!collapsed && label}
      </span>
    </Link>
  );
}
