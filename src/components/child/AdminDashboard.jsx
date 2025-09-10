"use client";

import { Icon } from "@iconify/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";

// ✅ Define API URLs
const MEMBER_REVENUE_BREAKDOWN_API = `${process.env.NEXT_PUBLIC_API_URL}/api/members/revenue/breakdown`;
const DASHBOARD_STATS_API = `${process.env.NEXT_PUBLIC_API_URL}/api/admin/stats`;
const TOTAL_REVENUE_API = `${process.env.NEXT_PUBLIC_API_URL}/api/admin/total-revenue`;
const API_URL = `${process.env.NEXT_PUBLIC_API_BASE}/api/admin`;

const UnitCountTwo = () => {
  const [stats, setStats] = useState(null);
  const [memberCheckins, setMemberCheckins] = useState(0);
  const [staffTrainerCheckins, setStaffTrainerCheckins] = useState(0);
  const [selectedGymId, setSelectedGymId] = useState("default-gym-id"); // ✅ Replace with real gym ID logic
  const [revenue, setRevenue] = useState({});
  const [totalRevenue, setTotalRevenue] = useState(0);

  const { getToken } = useAuth();

  useEffect(() => {
    if (selectedGymId) {
      fetchDashboardStats();
      // fetchRevenueBreakdown();
      // fetchTotalRevenue();
    }
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

      setStats(data);
      setMemberCheckins(data.memberCheckins || 0); // ✅ use correct property
      setStaffTrainerCheckins(data.staffTrainerAttendance || 0);
    } catch (err) {
      console.error("❌ Failed to fetch dashboard stats:", {
        message: err?.message,
        status: err?.response?.status,
        data: err?.response?.data,
      });
    }
  };

  const handleMemberAttendance = async (memberId) => {
    try {
      const token = await getToken();
      if (!token) return;

      const headers = { Authorization: `Bearer ${token}` };

      // ✅ Post attendance
      await axios.post(
        `${API}/api/attendance/member`,
        { memberId, gymId },
        { headers }
      );

      console.log("✅ Attendance added for member:", memberId);

      // 🔄 Refresh both stats and member list
      await fetchDashboardStats();
      await getPeopleList("Member");
    } catch (error) {
      console.error(
        "❌ Failed to add attendance:",
        error.response?.data || error.message
      );
    }
  };

  // const fetchRevenueBreakdown = async () => {
  //   try {
  //     const token = await getToken();
  //     if (!token) throw new Error("No token available");

  //     const EXPENSES_API = `${process.env.NEXT_PUBLIC_API_URL}/api/expenses`;

  //     const res = await axios.get(EXPENSES_API, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //       params: { gymId: selectedGymId }, // ✅ filter by gym
  //     });

  //     console.log("✅ Revenue breakdown (from expenses):", res.data);
  //     setRevenue(res.data);
  //   } catch (error) {
  //     console.error(
  //       "❌ Failed to fetch revenue",
  //       error.response?.data || error.message
  //     );
  //   }
  // };

  // const fetchTotalRevenue = async () => {
  //   try {
  //     const token = await getToken();

  //     console.log("🔍 selectedGymId:", selectedGymId);

  //     const isValidGymId = /^[a-f\d]{24}$/i.test(selectedGymId);

  //     const res = await axios.get(`${API_URL}/api/admin/total-revenue`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //       params: isValidGymId ? { gymId: selectedGymId } : {},
  //     });

  //     setTotalRevenue(res.data.totalRevenue);
  //   } catch (error) {
  //     console.error(
  //       "❌ Failed to fetch revenue",
  //       error.response?.data || error
  //     );
  //   }
  // };

  return (
    <div className="container mt-4">
      <h2 className="fw-bold">Admin Dashboard</h2>
      <p className="text-muted mb-4">Welcome back! Here's your gym overview.</p>

      <div className="row g-4 mb-4">
        <StatCard
          icon="mdi:account-group"
          color="primary"
          title="Total Members"
          value={stats?.members ?? 0}
        />
        <StatCard
          icon="mdi:clock-check-outline"
          color="success"
          title="Total Trainers"
          value={stats?.trainers ?? 0}
        />
        {/* <StatCard
          icon="mdi:currency-usd"
          color="warning"
          title="Total Revenue"
          value={`₹${totalRevenue.toLocaleString("en-IN")}`}
        /> */}

        
        <StatCard
          icon="mdi:cash-minus"
          color="danger"
          title="Total Expenses"
          value={`₹${(stats?.expenses ?? 0).toLocaleString("en-IN")}`}
        />
        <StatCard
          icon="mdi:chart-line"
          color="purple"
          title="Total Staff"
          value={stats?.staff ?? 0}
        />
        <StatCard
          icon="mdi:account-check"
          color="info"
          title="Members Checked-in Today"
          value={memberCheckins}
        />
        <StatCard
          icon="mdi:account-tie"
          color="dark"
          title="Staff & Trainers Checked-in"
          value={staffTrainerCheckins}
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
