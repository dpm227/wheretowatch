import { query } from "@/app/db/postgres";

export async function GET(request, { params }) {
  try {
    // this needs to match the exact folder name
    const { movieTitle } = await params;
    let movie = await query(
      `Select * from "Movie" where title ilike $1 limit 20`,
      [`%${movieTitle}%`]
    );
    return new Response(JSON.stringify(movie.rows), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "An error occurred" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
