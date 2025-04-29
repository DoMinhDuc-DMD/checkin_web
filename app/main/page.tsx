"use client";

import { useEffect, useState } from "react";
import { Button, Divider, notification } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import "@ant-design/v5-patch-for-react-19";
import { DATE_FORMAT, TIME_FORMAT } from "../constant/dateFormat";
import FlagIcon from "@mui/icons-material/Flag";

export default function Main() {
  const [currentDate, setCurrentDate] = useState<dayjs.Dayjs | null>(null);
  const [currentTime, setCurrentTime] = useState<dayjs.Dayjs | null>(null);
  const [checkIn, setCheckIn] = useState<dayjs.Dayjs | null>(null);
  const [checkOut, setCheckOut] = useState<dayjs.Dayjs | null>(null);
  const [api, contextHolder] = notification.useNotification();

  dayjs.locale("vi");

  const openNotification = (msg: string, des: string) => {
    api.info({
      message: msg,
      description: des,
      placement: "topRight",
      duration: 2,
      style: { borderRadius: 10 },
    });
  };

  useEffect(() => {
    setCurrentDate(dayjs());
    const interval = setInterval(() => {
      setCurrentTime(dayjs());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleClick = () => {
    if (!checkIn) {
      setCheckIn(currentTime);
      openNotification("Check in thành công!", `Check in: ${currentTime?.format(TIME_FORMAT)}`);
    } else if (!checkOut) {
      setCheckOut(currentTime);
      openNotification("Check out thành công!", `Check out: ${currentTime?.format(TIME_FORMAT)}`);
    }
  };

  return (
    <>
      {contextHolder}
      <div className="grid grid-cols-2 mt-30">
        <div className="flex flex-col items-center gap-y-5">
          <div className="text-3xl">
            {currentDate ? `${capitalizeFirstLetter(currentDate.format("dddd"))}, ${currentDate.format(DATE_FORMAT)}` : "Đang tải..."}
          </div>
          <div className="text-3xl">{currentTime ? currentTime.format(TIME_FORMAT) : "Đang tải..."}</div>
          <Button type="primary" size="large" onClick={handleClick} disabled={!!checkOut} className="my-20">
            {!checkIn ? "Check in" : "Check out"}
          </Button>
          <div className="text-xl">{!checkIn ? "Bạn chưa check in." : `Bạn đã check in lúc: ${checkIn.format(TIME_FORMAT)}`}</div>
          <div className="text-xl">{!checkOut ? "Bạn chưa check out." : `Bạn đã check out lúc: ${checkOut.format(TIME_FORMAT)}`}</div>
        </div>
        <div className="flex flex-col gap-y-10 p-10">
          {/* Not time yet */}
          <div className="flex gap-x-20">
            <FlagIcon />
            <div>18:00:00</div>
            <div>Kết thúc ngày làm việc</div>
          </div>
          {/* Present */}
          <div className="flex items-center gap-2">
            <div style={{ width: "85%", height: "1px", backgroundColor: "black" }} />
            <div>{currentTime ? currentTime.format(TIME_FORMAT) : "Đang tải..."}</div>
          </div>
          {/* Passed time */}
          <div className="flex gap-x-20">
            <FlagIcon />
            <div>13:30:00</div>
            <div>Bắt đầu ca chiều</div>
          </div>
          <div className="flex gap-x-20">
            <FlagIcon />
            <div>12:00:00</div>
            <div>Kết thúc ca sáng</div>
          </div>
          <div className="flex gap-x-20">
            <FlagIcon />
            <div>08:30:00</div>
            <div>Bắt đầu ca sáng</div>
          </div>
        </div>
      </div>
    </>
  );
}
