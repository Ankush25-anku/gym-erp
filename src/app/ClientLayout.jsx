"use client";

import { usePathname } from "next/navigation";
import { UserProvider } from "../contexts/UserContext";
import PluginInit from "@/helper/PluginInit";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const isAuthPage =
    pathname?.startsWith("/sign-in") || pathname?.startsWith("/sign-up");

  return (
    <>
      <PluginInit />
      <UserProvider>
        {isAuthPage ? (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#f9f9f9",
              zIndex: 9999,
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: "400px",
              }}
            >
              {children}
            </div>
          </div>
        ) : (
          children
        )}
      </UserProvider>
    </>
  );
}
