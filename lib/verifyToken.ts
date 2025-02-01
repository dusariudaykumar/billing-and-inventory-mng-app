import jwt, { JwtPayload } from 'jsonwebtoken';

interface DecodedToken extends JwtPayload {
  exp: number;
}

export const verifyToken = (token: string): DecodedToken => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECREAT || 'test'
    ) as unknown as DecodedToken;

    // check if token is expired
    if (decoded.exp < Date.now() / 1000) {
      throw new Error('Token expired');
    }

    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
};
