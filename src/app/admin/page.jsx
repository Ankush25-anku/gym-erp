"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import MasterLayout from "@/masterLayout/MasterLayout"; // ✅ Replace AdminLayout with MasterLayout

export default function AdminPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;

    const role = user?.publicMetadata?.role || localStorage.getItem("userRole");

    if (role === "admin") {
      setIsAuthorized(true);
    } else {
      router.replace("/login");
    }
  }, [isLoaded, user, router]);

  if (!isAuthorized) return null;

  return (
    <MasterLayout>
      <h2 className="fw-bold">Admin Dashboard</h2>
      <p className="text-muted">Welcome, Admin! Manage your system here.</p>
    </MasterLayout>
  );
}
