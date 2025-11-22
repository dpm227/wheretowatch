import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import { useState, useEffect } from "react";

export default function MovieCard({ data }) {
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    async function load() {
      const imdbId = data.imdbId;

      if (!imdbId) {
        console.warn("No imdbId found:", data);
        return;
      }

      const res = await fetch(
        `https://api.themoviedb.org/3/find/${imdbId}?external_source=imdb_id`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZGZjZmNiMzVlNTBlNmRmMDAwZDFiODQzMzRmZTIzMCIsIm5iZiI6MTc2MzcwNzA3MC45NTI5OTk4LCJzdWIiOiI2OTIwMDhiZWJlYTU4ODRlZmVhZGMwZDMiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.C41FkuGV7QFMhYYxYTQzHF8LEImzQZJ0mjOMVexsgHc",
          },
        }
      );

      const json = await res.json();

      const movieData = json.movie_results?.[0] || null;
      console.log(movieData);
      setMovie(movieData);
    }

    load();
  }, [data]);
  return (
    <Card
      sx={{
        maxWidth: 345,
        height: 650,
        backgroundColor: "#404040",
        color: "white",
        borderRadius: 3,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardActionArea
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
        }}
      >
        <CardMedia
          component="img"
          height="250"
          image={
            movie?.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : "https://placehold.co/500x750?text=No+Image"
          }
          alt={data.title}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h5" component="div">
            {data.title}
          </Typography>
          <Typography variant="body2">{movie?.popularity}</Typography>
          <Typography variant="body2">{movie?.release_date}</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
