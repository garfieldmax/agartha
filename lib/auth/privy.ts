import { AppError } from "@/lib/errors";
import {
  SessionUser,
  clearSessionCookie,
  readSessionFromCookies,
  readSessionFromRequest,
} from "@/lib/auth/session";

const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

if (!PRIVY_APP_ID) {
  throw new Error("NEXT_PUBLIC_PRIVY_APP_ID is not configured");
}

type PrivyApiUser = {
  id: string;
  created_at?: number;
  linked_accounts?: Array<{
    type: string;
    address?: string;
    email?: string;
  }>;
};

type PrivyApiResponse = {
  user?: PrivyApiUser;
};

function normalizeLinkedAccounts(accounts: PrivyApiUser["linked_accounts"]) {
  if (!Array.isArray(accounts)) {
    return [] as SessionUser["linkedAccounts"];
  }

  return accounts.map((account) => ({
    type: account.type,
    address: account.address,
    email: account.email,
  }));
}

export async function fetchPrivyUser(token: string): Promise<SessionUser> {
  const response = await fetch("https://auth.privy.io/api/v1/users/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "privy-app-id": PRIVY_APP_ID!,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new AppError("Invalid Privy token", "UNAUTHENTICATED");
    }

    throw new AppError("Failed to verify Privy token", "UNAUTHENTICATED");
  }

  const payload = (await response.json()) as PrivyApiResponse;
  const user = payload.user;
  if (!user?.id) {
    throw new AppError("Missing member id in Privy session", "UNAUTHENTICATED");
  }

  const linkedAccounts = normalizeLinkedAccounts(user.linked_accounts);
  const emailAccount = linkedAccounts.find((account) => account.type === "email");

  return {
    id: user.id,
    createdAt: user.created_at ?? Date.now(),
    linkedAccounts,
    email: emailAccount?.email,
  };
}

export async function getSessionUser() {
  return readSessionFromCookies();
}

export async function getSessionFromRequest(request?: Request) {
  if (!request) {
    return readSessionFromCookies();
  }
  return readSessionFromRequest(request);
}

export async function getAuthenticatedMember(request?: Request) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    throw new AppError("Missing authenticated session", "UNAUTHENTICATED");
  }

  return { memberId: session.id, session };
}

export async function optionalMember(request?: Request) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return null;
  }
  return { memberId: session.id, session };
}

export async function clearServerSession() {
  await clearSessionCookie();
}

export function attachMemberToHeaders(response: Response, memberId: string) {
  const headersCopy = new Headers(response.headers);
  headersCopy.set("x-member-id", memberId);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: headersCopy,
  });
}
