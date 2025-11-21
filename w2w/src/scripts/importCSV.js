// This script was generated with ChatGPT
// Prompt: write me a JS script using the watchmode API, specifically to
// read the csv file and post it into my postgres sql database
// here are the csv headers Watchmode ID IMDB ID TMDB ID TMDB Type Title Year
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function importCSV() {
  const results = [];
  const filePath = path.join(process.cwd(), "src/data/title_id_map.csv");

  console.log("Reading CSV at:", filePath);

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => {
      results.push({
        wmId: Number(row["Watchmode ID"]),
        title: row["Title"],
        imdbId: row["IMDB ID"] || null,
        tmdbId: row["TMDB ID"] ? Number(row["TMDB ID"]) : null,
        year: row["Year"] ? Number(row["Year"]) : null,
      });
    })
    .on("end", async () => {
      console.log(`Parsed ${results.length} rows`);
      console.log("Upserting into database...");

      try {
        // Limit concurrency so we don’t overload DB
        const chunkSize = 100;
        for (let i = 0; i < results.length; i += chunkSize) {
          const chunk = results.slice(i, i + chunkSize);

          await Promise.all(
            chunk.map((movie) =>
              prisma.movie.upsert({
                where: { wmId: movie.wmId },
                update: {
                  title: movie.title,
                  imdbId: movie.imdbId,
                  tmdbId: movie.tmdbId,
                  year: movie.year,
                },
                create: movie,
              })
            )
          );

          console.log(
            `Processed ${Math.min(i + chunkSize, results.length)} movies`
          );
        }

        console.log("Upsert complete!");
      } catch (err) {
        console.error("Error during upsert:", err);
      } finally {
        await prisma.$disconnect();
      }
    })
    .on("error", (err) => {
      console.error("Error reading CSV:", err);
    });
}

importCSV();
