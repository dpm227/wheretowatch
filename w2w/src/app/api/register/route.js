import bcrypt from "bcrypt";
import { query } from "@/app/db/postgres";

export async function POST(req) {
    try{
        const body = await req.json();
        const { username, password, name, role } = body;
        if(!username || !password || !name || !role){
            return new Response(JSON.stringify({ error: "Username, name, role and password are required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }
        const existingUser = await query(`select * from "User" where username = $1`, [username]);
        if(existingUser.rows.length > 0){
            return new Response(JSON.stringify({ error: "Username already exists" }), {
            status: 400});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await query(
            `insert into "User" (username, password, name, role) values ($1, $2, $3, $4)`,
            [username, hashedPassword, name, role]
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

/*  I used this reference https://medium.com/@bhupendra_Maurya/password-hashing-using-bcrypt-e36f5c655e09 to help with
bcrypt password hashing and comparison and I also referenced https://dev.to/justinw7/status-codes-in-programming-4me0 
to try and figure out what status codes I should use when errors/successes occured.  */