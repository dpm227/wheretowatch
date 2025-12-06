//script to create mock users and watchlist data for testing
//run with: node src/scripts/seedMockData.js

require("dotenv").config();
const bcrypt = require("bcrypt");
const pg = require("pg");

const { Client } = pg;

async function seedMockData() {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    database: process.env.POSTGRES_DBNAME,
    user: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    ssl: process.env.POSTGRES_SSL === "true" ? { rejectUnauthorized: false } : false,
  });

  await client.connect();
  console.log("connected to database");

  try {
    //hash password for mock users
    const hashedPassword = await bcrypt.hash("password123", 10);

    //create mock users
    const mockUsers = [
      { username: "john_doe", name: "John Doe", role: "USER" },
      { username: "jane_smith", name: "Jane Smith", role: "USER" },
      { username: "movie_lover", name: "Movie Lover", role: "USER" },
      { username: "admin_user", name: "Admin User", role: "ADMIN" },
    ];

    const userIds = [];

    for (const user of mockUsers) {
      //check if user already exists
      const existing = await client.query(
        `select id from "User" where username = $1`,
        [user.username]
      );

      if (existing.rows.length > 0) {
        console.log(`user ${user.username} already exists with id ${existing.rows[0].id}`);
        userIds.push({ ...user, id: existing.rows[0].id });
      } else {
        const result = await client.query(
          `insert into "User" (username, password, name, role) values ($1, $2, $3, $4) returning id`,
          [user.username, hashedPassword, user.name, user.role]
        );
        console.log(`created user ${user.username} with id ${result.rows[0].id}`);
        userIds.push({ ...user, id: result.rows[0].id });
      }
    }

    //get some random movies from the database
    const moviesResult = await client.query(
      `select id, title from "Movie" where year is not null order by random() limit 20`
    );

    if (moviesResult.rows.length === 0) {
      console.log("no movies found in database. please import movies first.");
      return;
    }

    console.log(`found ${moviesResult.rows.length} movies to add to watchlists`);

    //assign movies to users' watchlists
    const watchlistAssignments = [
      { userIndex: 0, movieIndices: [0, 1, 2, 3, 4] },      //john_doe gets 5 movies
      { userIndex: 1, movieIndices: [2, 5, 6, 7] },         //jane_smith gets 4 movies
      { userIndex: 2, movieIndices: [0, 3, 8, 9, 10, 11] }, //movie_lover gets 6 movies
      { userIndex: 3, movieIndices: [1, 4, 12] },           //admin_user gets 3 movies
    ];

    for (const assignment of watchlistAssignments) {
      const user = userIds[assignment.userIndex];
      if (!user) continue;

      for (const movieIndex of assignment.movieIndices) {
        const movie = moviesResult.rows[movieIndex];
        if (!movie) continue;

        try {
          await client.query(
            `insert into "Watchlist" ("userId", "movieId") values ($1, $2) on conflict do nothing`,
            [user.id, movie.id]
          );
          console.log(`added "${movie.title}" to ${user.username}'s watchlist`);
        } catch (err) {
          console.log(`skipped "${movie.title}" for ${user.username} (might already exist)`);
        }
      }
    }

    console.log("\nmock data seeding complete!");
    console.log("\ntest accounts created:");
    console.log("------------------------");
    for (const user of userIds) {
      console.log(`username: ${user.username}, password: password123, role: ${user.role}`);
    }

  } catch (err) {
    console.error("error seeding mock data:", err);
  } finally {
    await client.end();
  }
}

seedMockData();
