"use client";

import { Button, Input } from "antd";

export default function Login() {
  return (
    <form className="w-[500px] flex flex-col gap-y-5 mx-auto mt-30 p-5 rounded-lg bg-gray-300">
      <h1 className="text-center font-semibold">Login</h1>
      <div className="flex justify-between gap-x-5">
        <label htmlFor="username">Username:</label>
        <Input style={{ width: 300 }} type="text" name="username" id="username" />
      </div>
      <div className="flex justify-between gap-x-5">
        <label htmlFor="password">Password:</label>
        <Input style={{ width: 300 }} type="password" name="password" id="password" />
      </div>
      <Button className="w-[100px] mx-auto" type="primary">
        Login
      </Button>
    </form>
  );
}
