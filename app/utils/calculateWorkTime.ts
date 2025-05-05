import dayjs from "dayjs";

export function calculateWorkTime(checkInList: string[], checkOutList: string[]) {
  let totalMinutes = 0;
  let totalDays = 0;

  for (let i = 0; i < checkInList.length; i++) {
    const checkInStr = checkInList[i];
    const checkOutStr = checkOutList[i];

    if (!checkInStr || !checkOutStr) continue;

    const checkIn = dayjs(checkInStr, "YYYY-MM-DD, HH:mm");
    const checkOut = dayjs(checkOutStr, "YYYY-MM-DD, HH:mm");

    if (checkIn.isValid() && checkOut.isValid()) {
      const diffMinutes = checkOut.diff(checkIn, "minute") - 90;
      if (diffMinutes > 0) {
        totalMinutes += diffMinutes;
        totalDays += 1;
      }
    }
  }

  return {
    totalHour: Math.round((totalMinutes / 60) * 10) / 10,
    totalCheck: totalDays,
  };
}
