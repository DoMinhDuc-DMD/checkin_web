import dayjs from "dayjs";

// Link api lấy data
export const apiLink = `http://192.168.1.80:4455/api/v1`;

// Các phần tử ngày hiện tại
export const today = dayjs(); // hôm nay
export const todayDayName = dayjs().format("ddd"); // tên thứ
export const todayDate = dayjs().date(); // ngày
export const todayMonthName = dayjs().format("MMM"); //tên tháng
export const todayMonth = dayjs().month() + 1; // tháng
export const todayYear = dayjs().year(); // năm

// Thời gian
export const HOUR_FORMAT = "HH:mm";

// Ngày tháng năm dùng gạch chéo
export const DMY_FORMAT = "DD/MM/YYYY";
export const DM_FORMAT = "DD/MM";
export const MY_FORMAT = "MM/YYYY";

// Ngày tháng năm dùng gạch ngang
export const DATE_FORMAT = "YYYY-MM-DD";
export const MONTH_FORMAT = "YYYY-MM";
export const DATE_HOUR_FORMAT = "YYYY-MM-DD, HH:mm";
