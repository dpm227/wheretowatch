import React from "react";
import { useState, useEffect } from "react";
import {Button, Card, Typography, Stack, MenuItem, TextField} from '@mui/material'

const SignUP = () =>{
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [role, setRole] = useState("");
    const [error, setError] = useState("");
    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const registercall = await fetch(`/api/register`, {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password,
                name, 
                role
            })
          })
          if(!registercall.ok){
            setError("Registration failed, try again")
        }
        else{
            window.location.reload();
        }
    } catch (err) {
        setError("API call failed")
    }
    }
  return(
    <Card>
        <Typography>
            SignUp
        </Typography>
        <form onSubmit={handleSubmit}>
        <Stack spacing={2}> 
            <TextField label = "username" value={username} onChange={(e) => setUsername(e.target.value)}/>
            <TextField label = "password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            <TextField label = "name" value={name} onChange={(e) => setName(e.target.value)}/>
            <TextField select label="Role" value={role} onChange={e => setRole(e.target.value)}>
                <MenuItem value="ADMIN">Admin</MenuItem>
                <MenuItem value="USER">User</MenuItem>
              </TextField>
              {error && (
                <Typography>{error}</Typography>
             )}
            <Button type="submit">
                SignUp
            </Button>
          </Stack>
        </form>
    </Card>

  );
}

export default SignUP
