import { query } from "@/app/db/postgres";

export async function GET(request) {
    try {
        let flights = await query(`Select * from flights limit 100`)
        return new Response(JSON.stringify(flights.rows), {
            headers: {"Content-Type": "application/json"}
        })
    } catch (err) {
        console.error(err)
        return new Response(JSON.stringify({error: 'An error occurred'}), {
            status: 500,
            headers: {"Content-Type": 'application/json'}
        })
    }
}

