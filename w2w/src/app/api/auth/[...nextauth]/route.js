import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { query } from "@/app/db/postgres";

const handler = NextAuth({
    session: {strategy: "jwt",},

    providers: [
        CredentialsProvider({
            name: "credentials", 
            authorize: async (credentials) => {
                const {username, password } = credentials;
                const qs = await query(
                `select * from "User" where username = $1 limit 1`, [username] );
                const user = qs.rows[0];
                if(!user){
                    return null;
                }
                const valid = await bcrypt.compare(password, user.password);
                if(!valid){
                    return null;
                }
                return{
                    id: user.id,
                    username: user.username,
                    name: user.name,
                    role: user.role,
                }
            },
            
        }),
    ],
    callbacks: {
        async jwt({token, user}){
            if(user){
                token.id = user.id
                token.username = user.username
                token.role = user.role
            }
            return token
        },
        async session({session, token}){
            if(token){
                session.user = {
                    id: token.id,
                    username: token.username,
                    role: token.role
                }
            }
            return session
        },
    },
});
export {handler as GET, handler as POST};

/* Followed this tutorial and modified it slightly: https://www.youtube.com/watch?v=nLgEERINs34 
 to help figure out NextAuth with Next.js
 Also referenced NextAuth documentation: https://next-auth.js.org/getting-started/introduction
 I used this reference https://medium.com/@bhupendra_Maurya/password-hashing-using-bcrypt-e36f5c655e09 to help with
bcrypt password hashing and comparison */