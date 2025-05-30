"use client";

import { MistakeRecordType, User, UserTrackerRecord } from "@/app/constant/DataType";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function MistakeRecordData(user: User[], userTracker: UserTrackerRecord[]) {
  const { t } = useTranslation();
  const [originalMistakeRecord, setOriginalMistakeRecord] = useState<MistakeRecordType[]>([]);

  useEffect(() => {
    if (!userTracker || userTracker.length === 0) return;

    const result: MistakeRecordType[] = [];
    userTracker.forEach((ut) => {
      const matchedUser = user.find((u) => u._id === ut.userId);

      if (!matchedUser) return;
      // Kiểm tra nhân viên đã có chưa
      let existedUser = result.find((res) => res.userId === ut.userId);
      if (!existedUser) {
        existedUser = {
          userId: ut.userId,
          displayName: matchedUser.displayName,
          email: matchedUser.email,
          role: matchedUser.role,
          createdAt: matchedUser.createdAt,
          checkInLateCount: 0,
          checkOutEarlyCount: 0,
          trackRecord: [],
        };
        result.push(existedUser);
      }
      // Lọc thời gian check in, check out của nhân viên mỗi ngày và phân loại lỗi
      ut.records.forEach(({ dateStr, checkIn, checkOut }) => {
        const morningShiftStart = dayjs(dateStr).hour(8).minute(30);
        const afternoonShiftEnd = dayjs(dateStr).hour(18);

        const isInLate = dayjs(checkIn).isAfter(morningShiftStart);
        const isOutEarly = dayjs(checkOut).isBefore(afternoonShiftEnd);

        if (isInLate || isOutEarly) {
          const type = isInLate && isOutEarly ? t("In late, out early") : isInLate ? t("In late") : t("Out early");

          if (isInLate) existedUser.checkInLateCount++;
          if (isOutEarly) existedUser.checkOutEarlyCount++;

          existedUser.trackRecord.push({
            date: dateStr,
            checkIn: checkIn,
            checkOut: checkOut,
            typeMistake: type,
          });
        }
      });
    });

    setOriginalMistakeRecord(result);
  }, [userTracker, t]);
  return { originalMistakeRecord };
}
