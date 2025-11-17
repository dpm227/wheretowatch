import { query } from "@/app/db/postgres";

export async function GET(request,{params}) {
    try {
        // this needs to match the exact folder name
        const {filmid} = await params
        let films = await query(`Select * from films_mao523 where film_id =$1`, [filmid])
        return new Response(JSON.stringify(films.rows), {
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