import { query } from "../../db/postgres";

export async function GET(request, { params }) {
  try {
    // this needs to match the exact folder name
    const { movieId } = await params;
    let films = await query(`Select * from Movie where id =${movieId}`, [
      filmid,
    ]);
    return new Response(JSON.stringify(films.rows), {
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
