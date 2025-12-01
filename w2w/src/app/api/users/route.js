import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { query } from "@/app/db/postgres";

const jsonHeaders = { "Content-Type": "application/json" };

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.isAdmin) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: jsonHeaders,
    });
  }

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

  const rows = await query(
    `
      SELECT u.auth_id as "authId",
             COALESCE(u.name, 'User') as name,
             u.email,
             u.is_admin as "isAdmin",
             u.created_at as "createdAt",
             COUNT(w.id) as "watchlistCount"
      FROM "UserProfile" u
      LEFT JOIN "Watchlist" w ON w."userAuthId" = u.auth_id
      GROUP BY u.auth_id, u.name, u.email, u.is_admin, u.created_at
      ORDER BY u.created_at ASC;
    `
  );

  return new Response(JSON.stringify(rows.rows), { headers: jsonHeaders });
}
