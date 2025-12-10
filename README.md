# WhereToWatch

## Project Overview
**Where to Watch** is a full-stack web application that helps users quickly discover where any movie or TV show is streaming, renting, or buying across major platforms. Users can search titles, save favorites, build watchlists, and view availability using aggregated data from Watchmode and TMDB. The purpose of the app is to give users a centralized, personalized hub for tracking their entertainment across platforms.

---

Team Members:
Sakshi: Full Stack,
Dylan: Full Stack,
Antonio: Full Stack

---

## Application Features (How it meets each requirement)

### Accounts & Roles
- **NextAuth authentication**
- **User (Free):**
  - Search movies/TV shows  
  - View streaming availability by region  
  - Create watchlists and favorites  
  - Choose preferred streaming platforms  
- **Admin:**
  - Moderate content

### Database Functionality (PostgreSQL + Prisma)
The database stores:
- Users & roles  
- Watchlists    
- Preferred streaming platforms  
- Cached movie titles

### Internal REST API
Internal endpoints include:
- `GET /api/movies` — Fetch list of movies (limit 100)
- `GET /api/movies/:movieId` — Fetch movie by ID
- `GET /api/movies/title/:movieTitle` — Search movies by title (case-insensitive partial match)
- `POST /api/register { username, password, name, role }` — Register a new user
- `GET /api/watchlist/:userId` — Fetch a user's watchlist (with movie details)
- `POST /api/watchlist/add { userId, movieId }` — Add a movie to a user's watchlist
- `DELETE /api/watchlist/remove { userId, movieId }` — Remove a movie from a user's watchlist
- `GET /api/watchlist/all` — Fetch all users' watchlists (admin)
- `GET /api/auth/[...nextauth]` — NextAuth handler (session/login endpoints)
- `POST /api/auth/[...nextauth]` — NextAuth handler (session/login endpoints)

### External REST APIs
- **Watchmode API**  
  - Streaming providers  
  - Renting/buying prices  
  - Provider links  
- **TMDB API**  
  - Poster images  
  - Trending films and shows  

### User Experience
- Responsive UI built with **React + Tailwind CSS + MUI**  
- Login portal that unlocks user-specific pages  
- Search interface with real-time media availability  
- Watchlist automatically stored in the database

### New Frameworks Used
- Prisma
- Tailwind CSS
- NextAuth
- TypeScript

---

## Installation & Setup Instructions (How to install, run, and configure the application)

### next js setup

1. run `npm install` in w2w/

### local postgres db

1. Make sure docker is open
2. In the w2w folder, run `docker compose up -d`
3. run `touch .env` in the w2w folder to create the env
4. set to the .env variables in the block quote below
5. run db migrations `npx prisma migrate dev` on every pull from main

```.env
DATABASE_URL="postgres://dev:dev@localhost:5432/w2w-db"
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DBNAME=w2w-db
POSTGRES_USERNAME=dev
POSTGRES_PASSWORD=dev
POSTGRES_SSL=false
```

### Possible Extra Imports

1. npm install next-auth
2. install npm install next-auth bcrypt 
3. npm install @mui/icons-material @mui/material @emotion/styled @emotion/react
4. npm install @watchmode/api-client

### downloading and updating the movies

1. Download the csv with all the movies here: https://api.watchmode.com/datasets/title_id_map.csv
2. Drag this csv file into src/data/
3. Then, in the w2w folder, run `node src/scripts/importCsv.js`


### connecting to the db to see tables

`psql postgres://dev:dev@localhost:5432/w2w-db`
