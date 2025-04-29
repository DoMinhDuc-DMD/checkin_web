"use client";

import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "../component/layout/Sidebar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const handleToggle = () => {
    const content = document.querySelector(".content") as HTMLElement;
    const isFullWidth = content.classList.contains("w-full");

    if (isFullWidth) {
      content.classList.remove("w-full");
      content.classList.add("w-[calc(100%-200px)]", "ml-[200px]");
    } else {
      content.classList.add("w-full");
      content.classList.remove("w-[calc(100%-200px)]", "ml-[200px]");
    }
  };

  return (
    <div className="flex bg-gray-300">
      <Sidebar />
      <div className="content fixed h-[100vh] w-[calc(100%-200px)] ml-[200px] bg-gray-200 transition-all duration-300">
        <div className="h-[50px] flex items-center px-5 bg-white">
          <MenuIcon className="cursor-pointer" onClick={handleToggle} />
        </div>
        <div className="h-[90%] m-3 p-3 bg-white rounded-xl">{children}</div>
      </div>
    </div>
  );
}
