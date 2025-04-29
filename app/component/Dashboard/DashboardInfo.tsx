import { dataCheckIn } from "@/app/TestData/Dashboard/data";

export default function DashboardInfo() {
  return (
    <div className="sticky left-0 z-10">
      <div className="grid grid-cols-6 font-semibold">
        <div className="border p-2 text-center bg-gray-200">STT</div>
        <div className="border p-2 text-center bg-gray-200">Mã NV</div>
        <div className="border p-2 text-center bg-gray-200 col-span-2">Họ và tên</div>
        <div className="border p-2 text-center bg-gray-200 col-span-2">Tổng công</div>
      </div>
      {dataCheckIn?.map((emp, index) => (
        <div className="grid grid-cols-6 bg-gray-100" key={emp.key}>
          <div className="border text-center p-2">{index + 1}</div>
          <div className="border text-center p-2">{emp.employee_code}</div>
          <div className="border text-center p-2 col-span-2">{emp.employee_name}</div>
          <div className="border text-center p-2">{emp.employee_check.reduce((sum, val) => sum + val, 0)} giờ</div>
          <div className="border text-center p-2">{emp.employee_check.filter((check) => check > 0).length} công</div>
        </div>
      ))}
    </div>
  );
}
