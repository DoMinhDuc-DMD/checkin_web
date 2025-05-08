import { CalculateWorkMinute } from "./CalculateWorkMinute";

export function CalculateWorkHour(checkInList: string[], checkOutList: string[]) {
  let totalMinutes = 0;
  let totalDays = 0;

  for (let i = 0; i < checkInList.length; i++) {
    const checkInStr = checkInList[i];
    const checkOutStr = checkOutList[i];

    const minutes = CalculateWorkMinute(checkInStr, checkOutStr);
    if (minutes > 0) {
      totalMinutes += minutes;
      totalDays += 1;
    }
  }

  return {
    totalHour: Math.round((totalMinutes / 60) * 10) / 10,
    totalCheck: totalDays,
  };
}
