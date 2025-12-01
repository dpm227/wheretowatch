import NextAuth from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";
import { query } from "@/app/db/postgres";

const requiredEnv = [
  "AUTH0_CLIENT_ID",
  "AUTH0_CLIENT_SECRET",
  "AUTH0_ISSUER",
  "NEXTAUTH_SECRET",
];

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required env variable: ${key}`);
  }
});

export const authOptions = {
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      issuer: process.env.AUTH0_ISSUER,
      authorization: { params: { prompt: "login" } },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (!token.id) {
        token.id = token.sub;
      }

      if (!token.sub) {
        return token;
      }

      // Ensure a local user profile exists; first user becomes admin
      await query(`
        CREATE TABLE IF NOT EXISTS "UserProfile" (
          id SERIAL PRIMARY KEY,
          auth_id TEXT UNIQUE NOT NULL,
          email TEXT,
          name TEXT,
          is_admin BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `);

      const existing = await query(
        `SELECT auth_id, email, name, is_admin FROM "UserProfile" WHERE auth_id = $1 LIMIT 1`,
        [token.sub]
      );

      if (existing.rowCount === 0) {
        const countRes = await query(
          `SELECT COUNT(*)::int as count FROM "UserProfile";`
        );
        const isFirstUser = (countRes.rows[0]?.count || 0) === 0;

        await query(
          `INSERT INTO "UserProfile" (auth_id, email, name, is_admin)
           VALUES ($1, $2, $3, $4)`,
          [
            token.sub,
            profile?.email ?? null,
            profile?.name ?? null,
            isFirstUser,
          ]
        );
        token.isAdmin = isFirstUser;
      } else {
        token.isAdmin = existing.rows[0].is_admin;
      }

      return token;
    },
    async session({ session, token }) {
      if (token?.sub) {
        session.user = session.user || {};
        session.user.id = token.sub;
        session.user.isAdmin = Boolean(token.isAdmin);
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
