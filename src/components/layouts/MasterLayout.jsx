"use client";
import React, { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";

const MasterLayout = ({ children }) => {
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    const syncUser = async () => {
      const token = await getToken();
      if (!token) return;

      await fetch("http://localhost:5000/api/clerkusers/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });
    };

    if (isSignedIn) {
      syncUser();
    }
  }, [getToken, isSignedIn]);

  return <>{children}</>;
};

export default MasterLayout;
