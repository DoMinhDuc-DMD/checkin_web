import { notification } from "antd";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export function useCustomNotification() {
  const { t } = useTranslation();
  const [api, contextHolder] = notification.useNotification();
  const openNotification = () => {
    api.info({
      message: t("Notice"),
      description: t("No suitable staff found!"),
      placement: "topRight",
      duration: 1,
      style: {
        width: 400,
        borderRadius: 10,
      },
    });
  };
  return useMemo(() => ({ openNotification, contextHolder }), [api]);
}
