import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
dayjs.extend(isSameOrAfter);

export function CalculateWorkMinute(checkInStr: string, checkOutStr: string) {
  const checkIn = dayjs(checkInStr);
  const checkOut = dayjs(checkOutStr);

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
