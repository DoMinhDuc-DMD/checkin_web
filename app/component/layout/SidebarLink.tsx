"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactElement } from "react";

export default function SidebarLink({
  link,
  icon,
  label,
  exact = true,
}: {
  link: string;
  icon: ReactElement;
  label: string;
  exact?: boolean;
}) {
  const pathName = usePathname();
  const isActive = exact ? pathName === link : pathName.startsWith(link);

  return (
    <Link href={link}>
      <span
        className={`text-black flex gap-x-5 px-8 py-3 hover:bg-blue-200 hover:rounded-r-4xl hover:font-semibold 
          ${isActive ? "bg-blue-200 rounded-r-4xl font-semibold" : ""}`}
      >
        {icon}
        {label}
      </span>
    </Link>
  );
}
