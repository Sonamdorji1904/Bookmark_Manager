import { z } from "zod";

export const authProviders = ["google", "github"] as const;

export type AuthProvider = (typeof authProviders)[number];

export const oauthUserSchema = z.object({
  provider: z.enum(authProviders),
  providerId: z.string().min(1),
  email: z.string().email(),
  name: z.string().min(1),
  avatar: z.string().url().nullable().optional(),
});

export type OAuthUserInput = z.infer<typeof oauthUserSchema>;
