//get all users' watchlists (for admin)
import { query } from "@/app/db/postgres";

export async function GET(request) {
  try {
    //get all watchlist entries with user and movie info
    const result = await query(
      `select w.id, w."userId", w."movieId", w."createdAt",
              u.username, u.name as "userName",
              m.id as "movie_id", m."wmId", m."imdbId", m."tmdbId", m.title, m.year
       from "Watchlist" w
       join "User" u on w."userId" = u.id
       join "Movie" m on w."movieId" = m.id
       order by u.username, w."createdAt" desc`
    );

    //group by user
    const grouped = {};
    for (const row of result.rows) {
      if (!grouped[row.userId]) {
        grouped[row.userId] = {
          userId: row.userId,
          username: row.username,
          userName: row.userName,
          movies: [],
        };
      }
      grouped[row.userId].movies.push({
        id: row.id,
        movieId: row.movieId,
        wmId: row.wmId,
        imdbId: row.imdbId,
        tmdbId: row.tmdbId,
        title: row.title,
        year: row.year,
        createdAt: row.createdAt,
      });
    }

    return new Response(JSON.stringify(Object.values(grouped)), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("error fetching all watchlists:", err);
    return new Response(
      JSON.stringify({ error: "failed to fetch watchlists" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

