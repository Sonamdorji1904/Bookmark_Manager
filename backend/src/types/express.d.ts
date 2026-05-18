import type { JwtPayload } from "../modules/auth/service";

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      name: string;
      avatar?: string | null;
      provider: "google" | "github";
      providerId: string;
    }

    interface Request {
      user?: JwtPayload;
    }
  }
}

export {};
