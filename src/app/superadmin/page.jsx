"use client";

import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import axios from "axios";
import dynamic from "next/dynamic";
import useReactApexChart from "@/hook/useReactApexChart";
import MasterLayout from "@/masterLayout/MasterLayout";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

// ✅ ADD THIS BLOCK HERE
const API_BASE = process.env.NEXT_PUBLIC_API_URL;

const SUPERADMIN_API = {
  MEMBERS: `${API_BASE}/api/superadmin/members`,
  TRAINERS: `${API_BASE}/api/superadmin/trainers`,
  STAFF: `${API_BASE}/api/superadmin/staff`,
  EXPENSES: `${API_BASE}/api/superadmin/expenses/total`,
  ATTENDANCE: `${API_BASE}/api/superadmin/attendance`,
};

const MEMBERS_API = `${API_BASE}/api/members`;
const TRAINERS_API = `${API_BASE}/api/admintrainers`;
const STAFF_API = `${API_BASE}/api/adminstaff`;
const EXPENSES_API = `${API_BASE}/api/expenses/total`;
const ATTENDANCE_API = `${API_BASE}/api/admin/attendance`;
const SuperAdminDashboard = () => {
  const [gyms, setGyms] = useState([]);
  const [selectedGymId, setSelectedGymId] = useState("");
  const [members, setMembers] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [staff, setStaff] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [memberCheckins, setMemberCheckins] = useState(0);
  const [staffTrainerCheckins, setStaffTrainerCheckins] = useState(0);
  const [currentMonthRevenue, setCurrentMonthRevenue] = useState(0);
  const [revenueOnlyOptions, setRevenueOnlyOptions] = useState(null);
  const [revenueOnlySeries, setRevenueOnlySeries] = useState([]);

  const [barChartSeriesTwo, setBarChartSeriesTwo] = useState([]);
  const [barChartOptionsTwo, setBarChartOptionsTwo] = useState(null);

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

const SUPERADMIN_API = {
  MEMBERS: `${API_BASE}/api/superadmin/members`,
  TRAINERS: `${API_BASE}/api/superadmin/trainers`,
  STAFF: `${API_BASE}/api/superadmin/staff`,
  EXPENSES: `${API_BASE}/api/superadmin/expenses/total`,
  ATTENDANCE: `${API_BASE}/api/superadmin/attendance`,
};



  useEffect(() => {
    fetchGyms();
    const storedGymId = localStorage.getItem("selectedGymId");
    if (storedGymId) setSelectedGymId(storedGymId);
  }, []);

useEffect(() => {
  if (selectedGymId) {
    console.log("Fetching data for gym:", selectedGymId);
    fetchAllStats();
    fetchMonthlyRevenueExpenses();
  }
}, [selectedGymId]);


  const fetchGyms = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE}/api/gyms`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGyms(res.data || []);
    } catch (err) {
      console.error("Failed to load gyms:", err);
    }
  };

  const fetchMonthlyRevenueExpenses = async () => {
    try {
      const token = localStorage.getItem("token");
      const endpoint =
        selectedGymId === "all"
          ? `${API_BASE}/api/members/revenue/breakdown?gymId=all`
          : `${API_BASE}/api/members/revenue/breakdown?gymId=${selectedGymId}`;

      const res = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const revenueData = res.data.monthlyRevenue || [];
      const expenseData = res.data.monthlyExpense || [];

      const allMonths = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      const revenueMap = Object.fromEntries(
        revenueData.map((r) => [r.month, r.total])
      );
      const expenseMap = Object.fromEntries(
        expenseData.map((e) => [e.month, e.total])
      );

      const revenueSeries = allMonths.map((m) => revenueMap[m] || 0);
      const expenseSeries = allMonths.map((m) => expenseMap[m] || 0);

      // ✅ Chart 1: Bar chart (Revenue vs Expenses)
      setBarChartSeriesTwo([
        { name: "Revenue", data: revenueSeries },
        { name: "Expenses", data: expenseSeries },
      ]);

      setBarChartOptionsTwo({
        chart: {
          type: "bar",
          height: 310,
          toolbar: { show: false },
        },
        plotOptions: {
          bar: {
            borderRadius: 4,
            horizontal: false,
            columnWidth: "45%",
            endingShape: "rounded",
          },
        },
        dataLabels: { enabled: false },
        colors: ["#00C897", "#FF4C4C"],
        fill: { type: "solid" },
        xaxis: {
          categories: allMonths,
          labels: { style: { fontSize: "12px" } },
        },
        yaxis: {
          labels: {
            formatter: (val) => `₹${Math.round(val)}`,
            style: { fontSize: "12px" },
          },
        },
        tooltip: {
          y: { formatter: (val) => `₹${Math.round(val)}` },
        },
        legend: {
          position: "top",
          horizontalAlign: "center",
        },
      });

      // ✅ Chart 2: Revenue-Only Line Chart
      setRevenueOnlySeries([
        {
          name: "Revenue",
          data: revenueSeries,
        },
      ]);

      setRevenueOnlyOptions({
        chart: {
          type: "line",
          height: 310,
          toolbar: { show: false },
        },
        stroke: {
          curve: "smooth",
          width: 3,
        },
        dataLabels: { enabled: false },
        colors: ["#4E82F4"],
        xaxis: {
          categories: allMonths,
          labels: { style: { fontSize: "12px" } },
        },
        yaxis: {
          labels: {
            formatter: (val) => `₹${Math.round(val)}`,
            style: { fontSize: "12px" },
          },
        },
        tooltip: {
          y: {
            formatter: (val) => `₹${Math.round(val)}`,
          },
        },
        legend: {
          position: "top",
          horizontalAlign: "center",
        },
      });

      // ✅ Update current month revenue
      const now = new Date();
      const currentMonth = now.toLocaleString("en-US", { month: "short" });
      const current = revenueData.find((item) => item.month === currentMonth);
      setCurrentMonthRevenue(current?.total || 0);
    } catch (err) {
      console.error("📉 Revenue fetch failed:", err);
    }
  };

const fetchAllStats = async () => {
  try {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    const today = new Date().toISOString().split("T")[0];

    // 🧹 Reset previous data before fetching
    setMembers([]);
    setTrainers([]);
    setStaff([]);
    setTotalRevenue(0);
    setTotalExpenses(0);
    setMemberCheckins(0);
    setStaffTrainerCheckins(0);

    let memberRes, trainerRes, staffRes, expenseRes, attendanceRes;

    if (selectedGymId === "all") {
      console.log("📡 Fetching stats for ALL gyms");
      [memberRes, trainerRes, staffRes, expenseRes, attendanceRes] = await Promise.all([
        axios.get(SUPERADMIN_API.MEMBERS, { headers }),
        axios.get(SUPERADMIN_API.TRAINERS, { headers }),
        axios.get(SUPERADMIN_API.STAFF, { headers }),
        axios.get(SUPERADMIN_API.EXPENSES, { headers }),
        axios.get(`${SUPERADMIN_API.ATTENDANCE}?date=${today}`, { headers }),
      ]);
    } else {
      console.log("📡 Fetching stats for gymId:", selectedGymId);
      [memberRes, trainerRes, staffRes, expenseRes, attendanceRes] = await Promise.all([
        axios.get(`${SUPERADMIN_API.MEMBERS}?gymId=${selectedGymId}`, { headers }), // ✅ FIXED
        axios.get(`${SUPERADMIN_API.TRAINERS}?gymId=${selectedGymId}`, { headers }),
        axios.get(`${SUPERADMIN_API.STAFF}?gymId=${selectedGymId}`, { headers }),
        axios.get(`${SUPERADMIN_API.EXPENSES}?gymId=${selectedGymId}`, { headers }),
        axios.get(`${SUPERADMIN_API.ATTENDANCE}?date=${today}&gymId=${selectedGymId}`, { headers }),
      ]);
    }

    // 🐞 Log members for debugging
    console.log("📦 Members Fetched:", memberRes.data);

    const membersData = memberRes.data || [];
    const trainersData = trainerRes.data || [];
    const staffData = staffRes.data || [];
    const expenseTotal = Number(expenseRes.data?.total || 0);
    const attendanceData = attendanceRes.data || [];

    setMembers(membersData);
    setTrainers(trainersData);
    setStaff(staffData);
    setTotalExpenses(expenseTotal);

    // 💰 Calculate revenue based on plan type
    let revenue = 0;
    membersData.forEach((member) => {
      const plan = member?.plan?.toLowerCase?.();
      if (plan?.includes("basic")) revenue += 1000;
      else if (plan?.includes("premium")) revenue += 6000;
      else if (plan?.includes("vip")) revenue += 12000;
    });
    setTotalRevenue(revenue);

    // 📈 Check-in calculations
    const memberCheckins = attendanceData.filter(
      (e) => e.status === "Check-in" && e.category?.toLowerCase() === "member"
    ).length;

    const staffTrainerCheckins = attendanceData.filter(
      (e) =>
        e.status === "Check-in" &&
        ["staff", "trainer"].includes(e.category?.toLowerCase())
    ).length;

    setMemberCheckins(memberCheckins);
    setStaffTrainerCheckins(staffTrainerCheckins);
  } catch (error) {
    console.error("🔍 Failed to fetch stats:", error);
  }
};





  return (
    <MasterLayout>
      <div className="container mt-4">
        <h2 className="fw-bold">Super Admin Dashboard</h2>
        <div className="mb-4">
          <label className="form-label">Select Gym:</label>
          <select
            className="form-select"
            value={selectedGymId}
            onChange={(e) => {
              const gymId = e.target.value;
              setSelectedGymId(gymId);
              localStorage.setItem("selectedGymId", gymId);
            }}
          >
            <option value="">-- Select a Gym --</option>
            <option value="all">All Gyms</option>
            {gyms.map((g) => (
              <option key={g._id} value={g._id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>

        {selectedGymId ? (
          <>
            <div className="row g-4 mb-4">
              <StatCard
                icon="mdi:account-group"
                color="primary"
                title="Total Members"
                value={members.length}
              />
              <StatCard
                icon="mdi:clock-check-outline"
                color="success"
                title="Total Trainers"
                value={trainers.length}
              />
              <StatCard
                icon="mdi:currency-usd"
                color="warning"
                title="Total Revenue"
                value={`₹${totalRevenue.toLocaleString("en-IN")}`}
              />
              <StatCard
                icon="mdi:chart-line"
                color="purple"
                title="Total Staff"
                value={staff.length}
              />
              <StatCard
                icon="mdi:cash-minus"
                color="danger"
                title="Total Expenses"
                value={`₹${totalExpenses.toLocaleString("en-IN")}`}
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

            {/* 📊 Revenue vs Expense Graph */}
        <div className="card border-0 shadow-sm mt-4">
  <div className="card-body">
    <div className="d-flex justify-content-between align-items-center mb-3">
      <div>
        <h5 className="fw-bold mb-1">Earning Statistics</h5>
        <small className="text-muted">Revenue vs Expenses (Monthly)</small>
      </div>
      <div className="text-end">
        <h6 className="mb-1 fw-bold">₹{currentMonthRevenue}</h6>
        <span className="badge bg-success-subtle text-success">
          +{Math.round(currentMonthRevenue * 0.2)} est.
        </span>
      </div>
    </div>

    <div className="row">
      {/* 📈 Revenue Growth (Line Chart) */}
      <div className="col-md-6 mb-4">
        <div className="card border-0 shadow-sm h-100">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h5 className="fw-bold mb-1">Revenue Growth</h5>
                <small className="text-muted">Monthly Report</small>
              </div>
              <div className="text-end">
                <h6 className="mb-1 fw-bold">₹{currentMonthRevenue}</h6>
                <span className="badge bg-success-subtle text-success">
                  +{Math.round(currentMonthRevenue * 0.2)} (est.)
                </span>
              </div>
            </div>

            {revenueOnlyOptions && revenueOnlySeries.length > 0 ? (
              <ReactApexChart
                options={revenueOnlyOptions}
                series={revenueOnlySeries}
                type="line"
                height={310}
              />
            ) : (
              <p className="text-muted text-center">Loading chart...</p>
            )}
          </div>
        </div>
      </div>

      {/* 📊 Revenue vs Expense (Bar Chart) */}
      <div className="col-md-6 mb-4">
        <div className="card border-0 shadow-sm h-100">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h5 className="fw-bold mb-1">Earning Statistic</h5>
                <small className="text-muted">Monthly Revenue vs Expenses</small>
              </div>
            </div>

            {barChartOptionsTwo && barChartSeriesTwo.length > 0 ? (
              <ReactApexChart
                options={barChartOptionsTwo}
                series={barChartSeriesTwo}
                type="bar"
                height={310}
              />
            ) : (
              <p className="text-muted text-center">Loading chart...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

          </>
        ) : (
          <p className="text-muted">
            No gym selected. Please choose a gym to display data.
          </p>
        )}
      </div>
    </MasterLayout>
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

export default SuperAdminDashboard;
