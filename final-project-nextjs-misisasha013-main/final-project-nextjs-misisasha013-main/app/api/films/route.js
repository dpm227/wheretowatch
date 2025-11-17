import { query } from "@/app/db/postgres";

export async function GET(request) {
    try {
        let films = await query(`Select * from films_mao523 limit 100`)
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

export async function POST(request) {
    try {
        let body = await request.json()
        const now = new Date()
        console.log(body)
        let qs = `Insert into films_mao523 (title, body, "date") values ('${body.title}', '${body.desc}', '${now.toISOString().split('T')[0]}')`
        let res = await query(qs)
        return new Response(JSON.stringify({rowsInserted: res.rowCount}), {
            headers: {"Content-Type": "application/json"}
        })
      } catch (err) {
        res.send('error', err)
      }

}