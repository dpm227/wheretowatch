//get watchlist for a specific user
import { query } from "@/app/db/postgres";

export async function GET(request, { params }) {
  try {
    const { userId } = await params;

    const watchlist = await query(
      `select w.id, w."userId", w."movieId", w."createdAt", 
              m.id as "movie_id", m."wmId", m."imdbId", m."tmdbId", m.title, m.year
       from "Watchlist" w
       join "Movie" m on w."movieId" = m.id
       where w."userId" = $1
       order by w."createdAt" desc`,
      [userId]
    );

    return new Response(JSON.stringify(watchlist.rows), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("error fetching watchlist:", err);
    return new Response(JSON.stringify({ error: "failed to fetch watchlist" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

