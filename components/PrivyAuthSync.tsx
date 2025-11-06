"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useEffect } from "react";

/**
 * Client component that syncs Privy auth state to server via cookies
 * This ensures server-side routes can access the authentication token
 */
export function PrivyAuthSync() {
  const { authenticated, getAccessToken } = usePrivy();

  useEffect(() => {
    if (authenticated) {
      // When authenticated, get the access token and store it for server-side access
      console.log('[PrivyAuthSync] User authenticated, getting access token...');
      getAccessToken()
        .then((token) => {
          if (token) {
            const tokenPreview = `${token.substring(0, 8)}...${token.substring(token.length - 4)}`;
            console.log(`[PrivyAuthSync] Got access token: ${tokenPreview}`);
            // Store token in a cookie that server can read
            document.cookie = `privy-access-token=${token}; path=/; max-age=3600; SameSite=Lax`;
            console.log('[PrivyAuthSync] Stored access token in cookie');
          } else {
            console.warn('[PrivyAuthSync] getAccessToken returned null');
          }
        })
        .catch((error) => {
          console.error("[PrivyAuthSync] Error getting access token:", error);
        });
    } else {
      console.log('[PrivyAuthSync] User not authenticated, clearing cookies');
      // Clear token when not authenticated
      document.cookie = "privy-access-token=; path=/; max-age=0";
    }
  }, [authenticated, getAccessToken]);

  return null;
}

