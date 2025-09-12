"use client";

import { Icon } from "@iconify/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";

// ✅ API URL for stats
const DASHBOARD_STATS_API = `${process.env.NEXT_PUBLIC_API_URL}/api/admin/stats`;

const UnitCountTwo = () => {
  const [stats, setStats] = useState({
    members: 0,
    trainers: 0,
    staff: 0,
    expenses: 0,
    memberCheckins: 0,
    staffTrainerAttendance: 0,
  });
  const [selectedGymId, setSelectedGymId] = useState(
    "68c2561875a4c4ea96662657"
  ); // your gym ID
  const { getToken } = useAuth();

  // Fetch dashboard stats whenever gymId changes
  useEffect(() => {
    if (selectedGymId) fetchDashboardStats();
  }, [selectedGymId]);

  const fetchDashboardStats = async () => {
    try {
      const token = await getToken();
      if (!token) return;

      const res = await axios.get(
        `${DASHBOARD_STATS_API}?gymId=${selectedGymId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = res.data;
      console.log("📊 Dashboard stats response:", data);

      setStats({
        members: data.members ?? 0,
        trainers: data.trainers ?? 0,
        staff: data.staff ?? 0,
        expenses: data.expenses ?? 0,
        memberCheckins: data.memberCheckins ?? 0,
        staffTrainerAttendance: data.staffTrainerAttendance ?? 0,
      });
    } catch (err) {
      console.error("❌ Failed to fetch dashboard stats:", {
        message: err?.message,
        status: err?.response?.status,
        data: err?.response?.data,
      });
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="fw-bold">Admin Dashboard</h2>
      <p className="text-muted mb-4">Welcome back! Here's your gym overview.</p>

      <div className="row g-4 mb-4">
        <StatCard
          icon="mdi:account-group"
          color="primary"
          title="Total Members"
          value={stats.members}
        />
        <StatCard
          icon="mdi:clock-check-outline"
          color="success"
          title="Total Trainers"
          value={stats.trainers}
        />
        <StatCard
          icon="mdi:cash-minus"
          color="danger"
          title="Total Expenses"
          value={`₹${stats.expenses.toLocaleString("en-IN")}`}
        />
        <StatCard
          icon="mdi:chart-line"
          color="purple"
          title="Total Staff"
          value={stats.staff}
        />
        <StatCard
          icon="mdi:account-check"
          color="info"
          title="Members Checked-in Today"
          value={stats.memberCheckins}
        />
        <StatCard
          icon="mdi:account-tie"
          color="dark"
          title="Staff & Trainers Checked-in"
          value={stats.staffTrainerAttendance}
        />
      </div>
    </div>
  );
};

const StatCard = ({ icon, color, title, value }) => (
  <div className="col-md-3 col-sm-6">
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body d-flex align-items-center gap-3">
        <div
          className={`bg-${color} text-white rounded-circle d-flex justify-content-center align-items-center`}
          style={{ width: 50, height: 50 }}
        >
          <Icon icon={icon} width={24} />
        </div>
        <div>
          <small className="text-muted">{title}</small>
          <h5 className="mb-0">{value}</h5>
        </div>
      </div>
    </div>
  </div>
);

export default UnitCountTwo;
