//remove a movie from user's watchlist
import { query } from "@/app/db/postgres";

export async function DELETE(request) {
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

    const result = await query(
      `delete from "Watchlist" 
       where "userId" = $1 and "movieId" = $2
       returning *`,
      [userId, movieId]
    );

    if (result.rows.length === 0) {
      return new Response(
        JSON.stringify({ error: "movie not found in watchlist" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify({ message: "removed from watchlist" }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("error removing from watchlist:", err);
    return new Response(
      JSON.stringify({ error: "failed to remove from watchlist" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

