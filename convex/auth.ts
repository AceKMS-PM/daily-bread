import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [
    Password,
    // Pour activer GitHub/Google, décommentez et ajoutez les clés dans Convex :
    // GitHub,  → GITHUB_ID + GITHUB_SECRET
    // Google,  → GOOGLE_ID + GOOGLE_SECRET
  ],
});