import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

export function CalculateWorkMinute(checkInStr: string, checkOutStr: string) {
  const checkIn = dayjs(checkInStr);
  const checkOut = dayjs(checkOutStr);

  let morningWorkTime = 0;
  let noonWorkTime = 0;

  let workingMinute = 0;
  let overtimeMinute = 0;

  if (!checkIn.isValid() || !checkOut.isValid()) return { workingMinute: 0, overtimeMinute: 0 };

  const morningShiftEnd = dayjs(checkIn).hour(12).minute(0);
  const afternoonShiftStart = dayjs(checkOut).hour(13).minute(30);

  // Nếu check in và out trong buổi sáng
  if (checkIn.isBefore(morningShiftEnd) && checkOut.isBefore(morningShiftEnd))
    morningWorkTime = Math.max(checkOut.diff(checkIn, "minute"), 0);
  else morningWorkTime = Math.max(morningShiftEnd.diff(checkIn, "minute"), 0);

  // Nếu check in vào giờ nghỉ trưa
  if (checkIn.isSameOrAfter(morningShiftEnd) || checkIn.isSameOrBefore(afternoonShiftStart))
    noonWorkTime = Math.max(checkOut.diff(afternoonShiftStart, "minute"), 0);

  // Nếu check in sau đầu ca chiều
  if (checkIn.isAfter(afternoonShiftStart)) noonWorkTime = Math.max(checkOut.diff(checkIn, "minute"), 0);

  workingMinute = morningWorkTime + noonWorkTime;
  if (workingMinute > 480) {
    overtimeMinute = workingMinute - 480;
  }

  return { workingMinute, overtimeMinute };
}
