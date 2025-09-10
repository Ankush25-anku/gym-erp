"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MasterLayout from "@/masterLayout/MasterLayout"; // Adjust path if needed

export default function MemberPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem("userRole");

    if (!role || role !== "member") {
      router.replace("/login"); // 🔁 Better UX with replace (no back)
    } else {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="text-center mt-5">
        <h4>Loading member dashboard...</h4>
      </div>
    );
  }

  return (
    <MasterLayout>
      <div className="container mt-5">
        <h2>Welcome, Member!</h2>
        <p>This is your member dashboard.</p>
      </div>
    </MasterLayout>
  );
}
