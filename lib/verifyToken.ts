import jwt from 'jsonwebtoken';

/**
 * Verifies a JWT token and returns decoded user info.
 * @param token - JWT Token
 * @returns Decoded user payload
 * @throws Error if token is invalid or expired
 */
export const verifyToken = (token: string) => {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET environment variable is not set');
    }

    return jwt.verify(token, secret as string) as {
      sub: string;
    };
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};
