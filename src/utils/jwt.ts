/**
 * Utility functions for parsing and validating JSON Web Tokens (JWT) on the client side.
 */

export interface JwtPayload {
  sub?: string;
  iat?: number;
  exp?: number;
  role?: string;
  [key: string]: any;
}

/**
 * Safely decodes a base64url-encoded string (JWT part).
 */
function decodeBase64Url(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
}

/**
 * Parses claims from a JWT string without verifying signature (verification happens on server).
 */
export function parseJwtPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    const decoded = decodeBase64Url(parts[1]);
    return JSON.parse(decoded) as JwtPayload;
  } catch {
    return null;
  }
}

/**
 * Checks if a JWT token is expired based on its 'exp' claim.
 */
export function isTokenExpired(token: string): boolean {
  const payload = parseJwtPayload(token);
  if (!payload || !payload.exp) {
    // If payload or exp is missing, treat as invalid/expired for security
    return true;
  }
  // exp is in seconds, Date.now() is in milliseconds
  const currentTimeInSeconds = Math.floor(Date.now() / 1000);
  return payload.exp <= currentTimeInSeconds;
}
