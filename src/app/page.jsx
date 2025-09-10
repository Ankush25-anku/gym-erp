'use client';

import { useAuth } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";

export default function HomePage() {
  const { userId } = useAuth();

  return (
    <div>
      <h1>Welcome, User ID: {userId}</h1>
      <UserButton afterSignOutUrl="/login" />
    </div>
  );
}
