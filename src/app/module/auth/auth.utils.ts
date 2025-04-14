import jwt, { JwtPayload, Secret } from 'jsonwebtoken';

export const createAccessToken = (
  jwtPayload: { email: string; role: string },
  secret: string,
) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn: '7d',
  });
};

export const createRefreshToken = (
  jwtPayload: { email: string; role: string },
  secret: string,
) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn: '365d',
  });
};

export const verifyToken = (token: string, secret: Secret) => {
  return jwt.verify(token, secret) as JwtPayload;
};
