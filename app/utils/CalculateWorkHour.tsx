import { CalculateWorkMinute } from "./CalculateWorkMinute";

export function CalculateWorkHour(checkInList: string[], checkOutList: string[]) {
  let totalWorkingMinutes = 0;
  let totalDays = 0;
  let totalOvertimeMinutes = 0;

  for (let i = 0; i < checkInList.length; i++) {
    const checkInStr = checkInList[i];
    const checkOutStr = checkOutList[i];

    const { workingMinute, overtimeMinute } = CalculateWorkMinute(checkInStr, checkOutStr);

    if (workingMinute > 0) {
      totalWorkingMinutes += workingMinute;
      totalDays += 1;
      totalOvertimeMinutes += overtimeMinute;
    }
  }
  return {
    totalWorkingHour: Math.round((totalWorkingMinutes / 60) * 10) / 10,
    totalCheck: totalDays,
    totalOvertimeHour: Math.round((totalOvertimeMinutes / 60) * 10) / 10,
  };
}
