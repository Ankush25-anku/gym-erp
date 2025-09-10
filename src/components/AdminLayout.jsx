// components/AdminLayout.jsx
"use client";

import AdminSidebar from "@/components/AdminSidebar"; // adjust path as needed

const AdminLayout = ({ children }) => {
  return (
    <div className="d-flex">
      <div className="admin-sidebar-container">
        <AdminSidebar />
      </div>
      <div className="admin-content-container flex-grow-1 p-4">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
