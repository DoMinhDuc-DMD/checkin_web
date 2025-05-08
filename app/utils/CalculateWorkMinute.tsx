import { DATE_HOUR_FORMAT } from "../constant/DateFormatting";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

export function CalculateWorkMinute(checkInStr: string, checkOutStr: string) {
  const checkIn = dayjs(checkInStr, DATE_HOUR_FORMAT);
  const checkOut = dayjs(checkOutStr, DATE_HOUR_FORMAT);

  if (!checkIn.isValid() || !checkOut.isValid()) return 0;
  const morningShiftEnd = dayjs(checkIn).hour(12).minute(0);
  const afternoonShiftStart = dayjs(checkOut).hour(13).minute(30);

  if (checkIn.isSameOrAfter(afternoonShiftStart)) {
    return Math.max(checkOut.diff(checkIn, "minute"), 0);
  }

  const morningWorkTime = Math.max(morningShiftEnd.diff(checkIn, "minute"), 0);
  const noonWorkTime = Math.max(checkOut.diff(afternoonShiftStart, "minute"), 0);
  return morningWorkTime + noonWorkTime;
}
