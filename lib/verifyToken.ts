import jwt from 'jsonwebtoken';

/**
 * Verifies a JWT token and returns decoded user info.
 * @param token - JWT Token
 * @returns Decoded user payload
 * @throws Error if token is invalid or expired
 */
export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET as string) as {
      sub: string;
    };
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};
