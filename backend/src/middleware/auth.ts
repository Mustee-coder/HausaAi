import type {
  Request,
  Response,
  NextFunction,
} from "express";

import jwt from "jsonwebtoken";

interface AuthUser {
  id: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

const jwtSecret: string = process.env.JWT_SECRET ?? "";

if (!jwtSecret) {
  throw new Error("JWT_SECRET is not defined");
}

function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated. Please log in.",
      });
    }

    const decoded = jwt.verify(token, jwtSecret);

    if (
      typeof decoded === "string" ||
      !("id" in decoded)
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid token.",
      });
    }

    req.user = {
      id: String(decoded.id),
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired session. Please log in again.",
    });
  }
}

export { requireAuth };