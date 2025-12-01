import { query } from "@/app/db/postgres";
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

const jsonHeaders = { "Content-Type": "application/json" };

const requireUserId = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return null;
  }
  return session.user.id;
};

export async function GET(req) {
  const userId = await requireUserId();
  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: jsonHeaders,
    });
  }

  const { searchParams } = new URL(req.url);
  const movieId = searchParams.get("movieId");

  if (movieId) {
    const exists = await query(
      `SELECT 1 FROM "Watchlist" WHERE "userAuthId" = $1 AND "movieId" = $2 LIMIT 1`,
      [userId, Number(movieId)]
    );
    return new Response(
      JSON.stringify({ inWatchlist: exists.rowCount > 0 }),
      { headers: jsonHeaders }
    );
  }

  const rows = await query(
    `
      SELECT w."movieId" AS "movieId",
             w."createdAt" AS "createdAt",
             m.title,
             m.year,
             m.id
      FROM "Watchlist" w
      JOIN "Movie" m ON m.id = w."movieId"
      WHERE w."userAuthId" = $1
      ORDER BY w."createdAt" DESC;
    `,
    [userId]
  );

  return new Response(JSON.stringify(rows.rows), { headers: jsonHeaders });
}

export async function POST(req) {
  const userId = await requireUserId();
  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: jsonHeaders,
    });
  }

  const { movieId } = await req.json();

  if (!movieId || Number.isNaN(Number(movieId))) {
    return new Response(JSON.stringify({ error: "Invalid movieId" }), {
      status: 400,
      headers: jsonHeaders,
    });
  }

  await query(
    `INSERT INTO "Watchlist" ("userAuthId", "movieId")
     VALUES ($1, $2)
     ON CONFLICT ("userAuthId", "movieId") DO NOTHING;`,
    [userId, Number(movieId)]
  );

  return new Response(JSON.stringify({ ok: true }), {
    status: 201,
    headers: jsonHeaders,
  });
}

export async function DELETE(req) {
  const userId = await requireUserId();
  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: jsonHeaders,
    });
  }

  const { movieId } = await req.json();

  if (!movieId || Number.isNaN(Number(movieId))) {
    return new Response(JSON.stringify({ error: "Invalid movieId" }), {
      status: 400,
      headers: jsonHeaders,
    });
  }

  await query(
    `DELETE FROM "Watchlist" WHERE "userAuthId" = $1 AND "movieId" = $2;`,
    [userId, Number(movieId)]
  );

  return new Response(JSON.stringify({ ok: true }), { headers: jsonHeaders });
}
