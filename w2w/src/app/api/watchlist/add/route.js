//add a movie to user's watchlist
import { query } from "@/app/db/postgres";

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, movieId } = body;

    if (!userId || !movieId) {
      return new Response(
        JSON.stringify({ error: "userId and movieId are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    //check if already in watchlist
    const existing = await query(
      `select id from "Watchlist" where "userId" = $1 and "movieId" = $2`,
      [userId, movieId]
    );

    if (existing.rows.length > 0) {
      return new Response(
        JSON.stringify({ error: "movie already in watchlist" }),
        {
          status: 409,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const result = await query(
      `insert into "Watchlist" ("userId", "movieId", "createdAt")
       values ($1, $2, now())
       returning *`,
      [userId, movieId]
    );

    return new Response(JSON.stringify(result.rows[0]), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("error adding to watchlist:", err);
    return new Response(
      JSON.stringify({ error: "failed to add to watchlist" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

