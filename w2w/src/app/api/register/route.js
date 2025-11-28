import bcrypt from "bcrypt";
import { query } from "@/app/db/postgres";

export async function POST(req, res) {
    try{
        const body = await req.json();
        const { username, password } = body;
        if(!username || !password){
            return new Response(JSON.stringify({ error: "Username and password are required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }
        const existingUser = await query(`SELECT * FROM "User" WHERE username = $1`, [username]);
        if(existingUser.rows.length > 0){
            return new Response(JSON.stringify({ error: "Username already exists" }), {
            status: 400});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await query(
            `INSERT INTO "USER" (username, password, name) VALUES ($1, $2, $3)`,
            [username, hashedPassword, username]
        )
        return new Response(JSON.stringify({ message: "User registered successfully" }), {
            status: 201,}
        );

    }
    catch (err) {
        console.error(err)
        return new Response(JSON.stringify({ error: "Registration error occurred" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }

}