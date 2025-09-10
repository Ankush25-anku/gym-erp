"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import MasterLayout from "@/masterLayout/MasterLayout";

export default function StaffPage() {
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role !== "staff") {
      router.push("/login");
    }
  }, []);

  return (
    <MasterLayout>
      <div className="container mt-4">
        <h2 className="fw-bold">Staff Dashboard</h2>
        <p className="text-muted">
          Welcome back, Lisa Staff! Here's what's happening at your gym today.
        </p>

        {/* Summary Cards */}
        <div className="row my-4">
          {[
            { label: "Check-ins Today", value: 127, color: "success", icon: "📈" },
            { label: "New Members", value: 8, color: "primary", icon: "👥" },
            { label: "Payments Due", value: 23, color: "warning", icon: "💳" },
            { label: "Renewals", value: 15, color: "info", icon: "📅" },
          ].map((item, index) => (
            <div className="col-md-3 mb-3" key={index}>
              <div className={`card border-0 shadow-sm text-center`}>
                <div className="card-body">
                  <div className={`fs-1 text-${item.color}`}>{item.icon}</div>
                  <div className="fs-5 fw-semibold mt-2">{item.label}</div>
                  <div className="fs-4 fw-bold">{item.value}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity & Quick Actions */}
        <div className="row">
          {/* Recent Activity */}
          <div className="col-md-6 mb-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h5 className="fw-bold">Recent Activity</h5>
                <p className="text-muted">Latest gym activities and updates</p>
                {[
                  { name: "John Doe", action: "Checked in", time: "10 mins ago" },
                  { name: "Sarah Wilson", action: "Completed workout", time: "25 mins ago" },
                  { name: "Mike Johnson", action: "Payment received", time: "1 hour ago" },
                  { name: "Emily Davis", action: "Booked session", time: "2 hours ago" },
                ].map((item, index) => (
                  <div className="d-flex justify-content-between align-items-center py-2" key={index}>
                    <div className="d-flex align-items-center">
                      <div className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center" style={{ width: 40, height: 40 }}>
                        {item.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div className="ms-3">
                        <div className="fw-semibold">{item.name}</div>
                        <div className="text-muted small">{item.action}</div>
                      </div>
                    </div>
                    <div className="text-muted small">{item.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="col-md-6 mb-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h5 className="fw-bold">Quick Actions</h5>
                <p className="text-muted">Common tasks and shortcuts</p>
                <div className="d-flex flex-column gap-3">
                  <div className="border rounded p-3">
                    <div className="fw-semibold">Check Attendance</div>
                    <div className="text-muted small">View daily attendance</div>
                  </div>
                  <div className="border rounded p-3">
                    <div className="fw-semibold">Schedule</div>
                    <div className="text-muted small">View today’s schedule</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MasterLayout>
  );
}
