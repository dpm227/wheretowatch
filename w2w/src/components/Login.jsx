import React from "react";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import {Button, Card, Typography, Stack, TextField} from '@mui/material'
const Login = () =>{
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const handleSubmit = async(e) => {
    e.preventDefault();

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (result.error) {
      setError("Invalid username/password");
    } else {
      window.location.href = "/search"; 
    }
  };
  return(
    <Card>
        <Typography>
            Login
        </Typography>
        <form onSubmit={handleSubmit}>
        <Stack spacing={2}> 
            <TextField label = "username" value={username} onChange={(e) => setUsername(e.target.value)}/>
            <TextField label = "password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                {error && (
                    <Typography>{error}</Typography>
                )}
            <Button type="submit">
                Login
            </Button>
          </Stack>
        </form>
    </Card>

  );



}

export default Login

//parts of the signup: username, password, name, and role (user/admin)
// for the signup and login I took a lot of inspiration from the baseline MUI template
//  (https://mui.com/material-ui/getting-started/templates/sign-in/)
//Additionally, used the NextAuth documentation to help with implementing the sign in feature 
// https://next-auth.js.org/getting-started/client