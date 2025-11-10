import { beforeEach, describe, expect, it, vi } from "vitest";

const cookiesMock = vi.fn();
const clearSessionCookieMock = vi.fn();
const signSessionMock = vi.fn();
const fetchPrivyUserMock = vi.fn();

vi.mock("next/headers", () => ({
  cookies: cookiesMock,
}));

vi.mock("@/lib/auth/session", () => ({
  SESSION_COOKIE_NAME: "session",
  SESSION_MAX_AGE_SECONDS: 123,
  clearSessionCookie: clearSessionCookieMock,
  signSession: signSessionMock,
}));

vi.mock("@/lib/auth/privy", () => ({
  fetchPrivyUser: fetchPrivyUserMock,
}));

describe("syncAuthToken", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.resetAllMocks();
    clearSessionCookieMock.mockResolvedValue(undefined);
    signSessionMock.mockResolvedValue({ token: "signed-token" });
    cookiesMock.mockReturnValue({
      set: vi.fn(),
      delete: vi.fn(),
    });
  });

  it("returns a friendly error when Privy is rate limiting", async () => {
    const { AppError } = await import("@/lib/errors");
    fetchPrivyUserMock.mockRejectedValue(
      new AppError("Privy rate limited", "SERVICE_UNAVAILABLE"),
    );

    const { syncAuthToken } = await import("@/actions/auth");

    const result = await syncAuthToken("token");

    expect(result).toEqual({
      success: false,
      error: "Privy is rate limiting right now—please try again in a moment",
    });
    expect(clearSessionCookieMock).not.toHaveBeenCalled();
  });

  it("clears the session cookie when the token is invalid", async () => {
    const { AppError } = await import("@/lib/errors");
    fetchPrivyUserMock.mockRejectedValue(
      new AppError("Invalid token", "UNAUTHENTICATED"),
    );

    const { syncAuthToken } = await import("@/actions/auth");

    const result = await syncAuthToken("token");

    expect(clearSessionCookieMock).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ success: false, error: "Failed to verify authentication" });
  });
});
