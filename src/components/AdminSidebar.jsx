"use client"; // required for hooks like usePathname

import Link from "next/link";
import { usePathname } from "next/navigation";

const AdminSidebar = () => {
  const pathname = usePathname(); // detects current route

  // All sidebar links
  const links = [
    { href: "/admin-dashboard", label: "Dashboard", color: "text-warning-main" },
    { href: "/attendance", label: "Attendance", color: "text-danger-main" },
    { href: "/members", label: "Members", color: "text-success-main" },
    { href: "/trainers", label: "Trainers", color: "text-purple" },
    { href: "/plans", label: "Plans", color: "text-info-main" },
    { href: "/schedule", label: "Schedule", color: "text-info-main" },
    { href: "/admin-staff", label: "Staff", color: "text-info-main" },
    { href: "/expenses", label: "Expenses", color: "text-info-main" },
    { href: "/gym", label: "Gym", color: "text-info-main" },
    { href: "/inventory", label: "Inventory", color: "text-info-main" },
    { href: "/income", label: "Income", color: "text-info-main" },
    { href: "/notifications", label: "Notifications", color: "text-info-main" },
    { href: "/payments", label: "Payments", color: "text-info-main" },
    { href: "/rolespermission", label: "Roles & Permissions", color: "text-info-main" },
  ];

  return (
    <ul className="admin-sidebar">
      {links.map(({ href, label, color }) => (
        <li key={href}>
          <Link
            href={href}
            className={`sidebar-link ${pathname === href ? "active-page" : ""}`}
          >
            <i className={`ri-circle-fill circle-icon ${color}`} /> {label}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default AdminSidebar;
