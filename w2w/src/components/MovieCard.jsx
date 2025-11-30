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
    <div className="w-82 h-120">
      <Card
        sx={{
          height: "100%",
          width: "100%",
          backgroundColor: "#404040",
          color: "white",
          borderRadius: 3,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CardActionArea
          sx={{
            flexGrow: 1,
          }}
        >
          <CardMedia
            component="img"
            image={
              movie?.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : "https://images.unsplash.com/photo-1604147706283-d7119b5b822c?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGxhaW4lMjB3aGl0ZXxlbnwwfHwwfHx8MA%3D%3D"
            }
            alt={data.title}
            className="h-95 object-cover"
          />
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography
              gutterBottom
              component="div"
              sx={{
                height: "24px",
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                fontSize: "clamp(0.8rem, 1.5vw, 1.25rem)",
              }}
            >
              {data.title}
            </Typography>
            <Typography variant="body2">{movie?.popularity || "0"}</Typography>
            <Typography variant="body2">
              {movie?.release_date || "Unknown"}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </div>
  );
}
