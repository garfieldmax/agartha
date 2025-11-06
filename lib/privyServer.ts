import { cookies, headers } from "next/headers";
import { cache } from "react";

const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
const privyAppSecret = process.env.PRIVY_APP_SECRET;

if (!privyAppId) {
  throw new Error("Missing NEXT_PUBLIC_PRIVY_APP_ID environment variable");
}

if (!privyAppSecret) {
  throw new Error("Missing PRIVY_APP_SECRET environment variable");
}

// Privy user type based on v3 API response
type PrivyUser = {
  id: string;
  createdAt: number;
  linkedAccounts: Array<{
    type: string;
    address?: string;
    email?: string;
  }>;
};

// Simple in-memory cache for token verification (prevents rate limiting)
// In production, consider using Redis or similar
const tokenCache = new Map<string, { user: PrivyUser; expiresAt: number }>();
const rateLimitCache = new Map<string, { user: PrivyUser; expiresAt: number }>();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes for successful verifications
const RATE_LIMIT_CACHE_TTL = 60 * 60 * 1000; // 1 hour for rate-limited tokens (longer to avoid retries)

// Internal function that does the actual work
async function getPrivyUserInternal(): Promise<PrivyUser | null> {
  try {
    // Privy v3 stores the access token in cookies
    // Check Authorization header first, then cookies
    const headersList = await headers();
    const authorization = headersList.get("authorization");
    
    let accessToken: string | null = null;
    
    if (authorization?.startsWith("Bearer ")) {
      accessToken = authorization.substring(7);
    } else {
      // Try to get from cookies (Privy SDK sets this)
      const cookieStore = await cookies();
      // Privy v3 uses different cookie names - check all possibilities
      // Also check for our custom cookie set by PrivyAuthSync component
      accessToken = 
        cookieStore.get("privy-access-token")?.value ??
        cookieStore.get("privy-token")?.value ??
        cookieStore.get("_privy_tk")?.value ?? 
        cookieStore.get("_privy_refresh_token")?.value ??
        cookieStore.get("privy_refresh_token")?.value ?? 
        cookieStore.get("privy_access_token")?.value ??
        null;
    }

    if (!accessToken) {
      return null;
    }

    // Log token info for debugging
    const tokenPreview = `${accessToken.substring(0, 8)}...${accessToken.substring(accessToken.length - 4)}`;
    console.log(`[getPrivyUser] Token: ${tokenPreview}`);

    // Check regular cache first
    const cached = tokenCache.get(accessToken);
    if (cached && cached.expiresAt > Date.now()) {
      console.log('[getPrivyUser] Using valid cache result');
      return cached.user;
    }

    // Check rate limit cache (if we've been rate limited before and cached the result)
    const rateLimitedCached = rateLimitCache.get(accessToken);
    if (rateLimitedCached && rateLimitedCached.expiresAt > Date.now()) {
      console.log('[getPrivyUser] Using rate-limited cache result');
      return rateLimitedCached.user;
    }

    console.log('[getPrivyUser] No cache found, calling Privy API...');

    // Verify token with Privy API v3
    // Using Privy's token verification endpoint
    const response = await fetch(`https://auth.privy.io/api/v1/users/me`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "privy-app-id": privyAppId,
        "Content-Type": "application/json",
      } as HeadersInit,
    });

    console.log(`[getPrivyUser] Privy API response status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      // If rate limited
      if (response.status === 429) {
        // If we have a cached result (even expired), use it and cache it longer
        if (cached) {
          console.log('[getPrivyUser] Rate limited, using expired cache and extending it');
          rateLimitCache.set(accessToken, {
            user: cached.user,
            expiresAt: Date.now() + RATE_LIMIT_CACHE_TTL,
          });
          return cached.user;
        }
        
        // If we have a rate-limited cache, use it
        if (rateLimitedCached) {
          console.log('[getPrivyUser] Rate limited, using rate-limit cache');
          return rateLimitedCached.user;
        }
        
        console.log('[getPrivyUser] Rate limited and no cache available');
        return null;
      }
      
      // If 401/403, token is invalid - clear all caches
      if (response.status === 401 || response.status === 403) {
        tokenCache.delete(accessToken);
        rateLimitCache.delete(accessToken);
      }
      
      console.log('[getPrivyUser] Token verification failed:', response.status, response.statusText);
      return null;
    }

    const responseData = await response.json();
    
    // Debug: Log the actual response structure
    console.log(`[getPrivyUser] Privy API response:`, { 
      responseKeys: Object.keys(responseData),
    });
    
    // Privy API returns user data nested in a 'user' property
    const user = responseData.user;
    
    if (user?.id) {
      console.log(`[getPrivyUser] Found user:`, { 
        userId: user.id.substring(0, 20) + '...',
        linkedAccountsCount: user.linked_accounts?.length,
      });
      
      const privyUser: PrivyUser = {
        id: user.id,
        createdAt: user.created_at || Date.now(),
        linkedAccounts: user.linked_accounts || [],
      };
      
      const cacheExpiry = Date.now() + CACHE_TTL;
      const rateLimitExpiry = Date.now() + RATE_LIMIT_CACHE_TTL;
      
      // Cache the result in memory
      tokenCache.set(accessToken, {
        user: privyUser,
        expiresAt: cacheExpiry,
      });
      rateLimitCache.set(accessToken, {
        user: privyUser,
        expiresAt: rateLimitExpiry,
      });
      
      console.log('[getPrivyUser] Successfully verified and cached user');
      return privyUser;
    }
    
    console.log('[getPrivyUser] API response missing user data - Full response:', JSON.stringify(responseData, null, 2));
    return null;
  } catch (error) {
    console.error('[getPrivyUser] Error:', error);
    // If error and we have cached result, use it
    const cookieStore = await cookies();
    const accessToken = 
      cookieStore.get("privy-access-token")?.value ??
      cookieStore.get("privy-token")?.value ??
      null;
    
    if (accessToken) {
      const cached = tokenCache.get(accessToken) || rateLimitCache.get(accessToken);
      if (cached && cached.expiresAt > Date.now()) {
        console.log('[getPrivyUser] Using cached result due to error');
        return cached.user;
      }
    }
    
    return null;
  }
}

// Wrap with React cache() to deduplicate calls within the same request
// This prevents multiple parallel calls from hitting the API/cache multiple times
export const getPrivyUser = cache(getPrivyUserInternal);

export async function requirePrivyUser(): Promise<PrivyUser> {
  const user = await getPrivyUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

