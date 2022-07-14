import { JwtUser } from "./jwt-user.inteface";

export interface JwtRefreshTokenPayload extends JwtUser {
  // issuing ip address
  ip_address?: string;

  iat?: number;
  nbf?: number;
  exp?: number;
}
