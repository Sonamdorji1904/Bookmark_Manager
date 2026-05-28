import dotenv from "dotenv";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { findOrCreateOAuthUser } from "../modules/auth/service";

dotenv.config();

const ensureEnv = (key: string) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`${key} is required`);
  }
  return value;
};

const backendBaseUrl = process.env.BACKEND_URL;

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user: Express.User, done) => {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: ensureEnv("GOOGLE_CLIENT_ID"),
      clientSecret: ensureEnv("GOOGLE_CLIENT_SECRET"),
      callbackURL: `${backendBaseUrl}/api/auth/google/callback`,
    },
    async (
      _accessToken: string,
      _refreshToken: string,
      profile: {
        id: string;
        displayName?: string;
        username?: string;
        emails?: Array<{ value: string }>;
        photos?: Array<{ value: string }>;
      },
      done: (error: Error | null, user?: Express.User | false) => void,
    ) => {
      try {
        const user = await findOrCreateOAuthUser({
          provider: "google",
          providerId: profile.id,
          email: profile.emails?.[0]?.value || `google_${profile.id}@placeholder.local`,
          name: profile.displayName || profile.username || "Google User",
          avatar: profile.photos?.[0]?.value || null,
        });

        done(null, {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          provider: user.provider,
          providerId: user.providerId,
        });
      } catch (error) {
        done(error as Error);
      }
    },
  ),
);

export default passport;
