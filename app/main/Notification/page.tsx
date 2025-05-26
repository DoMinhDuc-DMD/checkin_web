"use client";

import { Tracker, User, AttendanceType } from "@/app/constant/DataType";
import { Flex } from "antd";
import { useEffect, useState } from "react";

export default function Notification() {
  const [user, setUser] = useState<User[]>([]);
  const [tracker, setTracker] = useState<Tracker[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res1 = await fetch("http://192.168.1.80:4455/api/v1/users/?limit=100");
        const res2 = await fetch("http://192.168.1.80:4455/api/v1/trackers/?limit=100");
        if (!res1.ok || !res2.ok) throw new Error("Failed to fetch");

        const data1 = await res1.json();
        const data2 = await res2.json();

        // console.log(data1.data);

        const filteredUsers = data1.data.map((user: User) => ({
          _id: user._id,
          displayName: user.displayName,
          firstName: user.firstName,
          lastName: user.lastName,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          role: user.role,
        }));
        const filteredTrackers = data2.data.flatMap((tracker: AttendanceType) => tracker);

        console.log(filteredTrackers);

        setUser(filteredUsers);
        setTracker(filteredTrackers);
      } catch (err) {
        console.error("API error:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <Flex vertical style={{ height: "650px", overflowY: "auto" }}>
      {user.map((u) => {
        const userTrackers = tracker.filter((t) => t.user === u._id);

        return (
          <div key={u._id} style={{ border: "1px solid #ccc", padding: 10, borderRadius: 6 }}>
            <h3>
              {u.displayName} ({u.role})
            </h3>
            <p>
              Name: {u.firstName} {u.lastName} <br />
              Created at: {new Date(u.createdAt).toLocaleString()} <br />
              Updated at: {new Date(u.updatedAt).toLocaleString()}
            </p>
            <h4>Trackers:</h4>
            {userTrackers.length > 0 ? (
              <ul>
                {userTrackers.map((t) => (
                  <li key={t._id}>
                    [{t.type}] at {new Date(t.time).toLocaleString()}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No trackers found.</p>
            )}
          </div>
        );
      })}
    </Flex>
  );
}
