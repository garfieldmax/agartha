"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
  const cookieStore = await cookies();
  
  // Clear Privy cookies
  const privyCookies = [
    "privy-access-token",
    "privy-token",
    "privy-session",
    "privy-refresh-token",
    "privy-id-token"
  ];
  
  for (const cookieName of privyCookies) {
    cookieStore.delete(cookieName);
  }
  
  redirect("/login");
}

