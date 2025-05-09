import { notification } from "antd";
import { useMemo } from "react";

export function useCustomNotification() {
  const [api, contextHolder] = notification.useNotification();
  const openNotification = (msg: string, des: string) => {
    api.info({
      message: msg,
      description: des,
      placement: "topRight",
      duration: 2,
      style: {
        width: 400,
        borderRadius: 10,
      },
    });
  };
  return useMemo(() => ({ openNotification, contextHolder }), [api]);
}
