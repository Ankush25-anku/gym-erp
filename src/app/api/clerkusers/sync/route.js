import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(req) {
  try {
    const { userId } = auth(); // Clerk session info

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    console.log("✅ Synced by user ID:", userId);
    console.log("📦 Payload:", body);

    return NextResponse.json({ success: true, message: "User synced" });
  } catch (error) {
    console.error("❌ Error in sync route:", error);
    return NextResponse.json({ error: "Failed to sync" }, { status: 500 });
  }
}
