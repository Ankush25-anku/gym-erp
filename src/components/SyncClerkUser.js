"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser, useAuth } from "@clerk/nextjs";

const SyncClerkUser = () => {
  const { user, isLoaded: isUserLoaded } = useUser();
  const { getToken, isLoaded: isAuthLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const syncUser = async () => {
      if (!isUserLoaded || !isAuthLoaded) return;

      const token = await getToken();
      const email = user?.primaryEmailAddress?.emailAddress;

      if (!token || !email) {
        console.warn("Missing token or email.");
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/clerkusers/sync", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email,
            fullName: `${user.firstName} ${user.lastName}`,
            imageUrl: user.imageUrl,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          console.error("❌ Clerk user sync failed:", data);
          return;
        }

        console.log("✅ Clerk user synced:", data);

        // ✅ Role-based routing
        const role = data.role?.toLowerCase();
        switch (role) {
          case "member":
            router.push("/memberRole/dashboard");
            break;
          case "admin":
            router.push("/admin-dashboard");
            break;
          case "trainer":
            router.push("/trainer");
            break;
          case "superadmin":
            router.push("/superadmin");
            break;
          default:
            router.push("/dashboard");
            break;
        }
      } catch (err) {
        console.error("❌ Error syncing Clerk user:", err);
      }
    };

    syncUser();
  }, [isUserLoaded, isAuthLoaded, user, getToken]);

  return null; // No UI rendering
};

export default SyncClerkUser;
