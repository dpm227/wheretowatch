import { query } from "@/app/db/postgres";

export async function GET(request) {
  try {
    let films = await query(
      `select * from "Movie" WHERE year <= extract(year from CURRENT_DATE) order by year desc nulls last limit 100;`
    );
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
