import { expressjwt } from "express-jwt";
import jwksRsa from "jwks-rsa";

export const checkJwt = expressjwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://dev-83a44yp6ocoxkr5h.us.auth0.com/.well-known/jwks.json`, // ✅ FIXED
  }),
  audience: `https://jarvis-api`,
  issuer: `https://dev-83a44yp6ocoxkr5h.us.auth0.com/`, // ✅ ADD trailing slash
  algorithms: ["RS256"],
});