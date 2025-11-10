import { describe, expect, it, vi, afterEach, beforeEach } from "vitest";

const originalFetch = global.fetch;
const originalPrivyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
const originalSessionSecret = process.env.SESSION_SECRET;

describe("fetchPrivyUser", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.useFakeTimers();
    process.env.NEXT_PUBLIC_PRIVY_APP_ID = "test-app";
    process.env.SESSION_SECRET = "test-session-secret";
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    if (originalFetch) {
      global.fetch = originalFetch;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete (global as typeof global & { fetch?: typeof fetch }).fetch;
    }
    if (originalPrivyAppId) {
      process.env.NEXT_PUBLIC_PRIVY_APP_ID = originalPrivyAppId;
    } else {
      delete process.env.NEXT_PUBLIC_PRIVY_APP_ID;
    }
    if (originalSessionSecret) {
      process.env.SESSION_SECRET = originalSessionSecret;
    } else {
      delete process.env.SESSION_SECRET;
    }
  });

  it("retries after a rate limit and returns the Privy user", async () => {
    const responses = [
      new Response(null, { status: 429, headers: { "Retry-After": "1" } }),
      new Response(
        JSON.stringify({ user: { id: "user-123", created_at: 1_700_000_000, linked_accounts: [] } }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    ];

    const fetchMock = vi
      .fn<Parameters<typeof fetch>, ReturnType<typeof fetch>>()
      .mockImplementation(() => Promise.resolve(responses.shift()!));

    global.fetch = fetchMock as typeof fetch;

    const { fetchPrivyUser } = await import("@/lib/auth/privy");

    const userPromise = fetchPrivyUser("test-token");

    await vi.advanceTimersByTimeAsync(1000);

    const user = await userPromise;

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(user).toMatchObject({ id: "user-123" });
  });
});
