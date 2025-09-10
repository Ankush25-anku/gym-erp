"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import axios from "axios";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const EarningStaticOne = () => {
  const [barChartSeriesTwo, setBarChartSeriesTwo] = useState([]);
  const [barChartOptionsTwo, setBarChartOptionsTwo] = useState(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      const gymId = user?.gymId;

      if (!token || !gymId) {
        console.warn("⚠️ Token or Gym ID not found.");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      // ✅ Combined revenue and expense data from ONE route
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/members/revenue/breakdown?gymId=${gymId}`,
        { headers }
      );

      const revenueData = res.data.monthlyRevenue || [];
      const expenseData = res.data.monthlyExpense || [];

      console.log("✅ Revenue Data:", revenueData);
      console.log("✅ Expense Data:", expenseData);

      const allMonths = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ];

      const revenueMap = Object.fromEntries(
        revenueData.map((r) => [r.month, r.total])
      );
      const expenseMap = Object.fromEntries(
        expenseData.map((e) => [e.month, e.total])
      );

      const revenueSeries = allMonths.map((m) => revenueMap[m] || 0);
      const expenseSeries = allMonths.map((m) => expenseMap[m] || 0);

      console.log("📊 Revenue Series:", revenueSeries);
      console.log("📊 Expense Series:", expenseSeries);

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
        colors: ["#00C897", "#FF4C4C"], // Revenue = green, Expense = red
        fill: { type: "solid" },
        xaxis: {
          categories: allMonths,
          axisBorder: { show: false },
          axisTicks: { show: false },
          labels: { style: { fontSize: "12px" } },
        },
        yaxis: {
          labels: {
            formatter: (val) => `₹${Math.round(val)}`,
            style: { fontSize: "12px" },
          },
        },
        grid: {
          borderColor: "#e0e0e0",
          strokeDashArray: 4,
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
    } catch (err) {
  console.error("❌ Failed to fetch revenue", {
    message: err.message,
    response: err.response?.data,
    status: err.response?.status,
    full: err,
  });
}

  };

  fetchData();
}, []);


  return (
    <div className="col-xxl-8">
      <div className="card h-100 radius-8 border-0">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h6 className="fw-bold text-lg mb-1">Earning Statistic</h6>
              <span className="text-muted text-sm">
                Monthly Revenue vs Expenses
              </span>
            </div>
          </div>

          <div id="barChart" style={{ minHeight: 310 }}>
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
  );
};

export default EarningStaticOne;
