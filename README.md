# wheretowatch

## Name: Where’s My Movie?

Team Members:
Sakshi: Full Stack,
Dylan: Full Stack,
Antonio: Full Stack

## Application Features (How it meets each requirement)



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

### User Database stuff

1. npm install next-auth
2. install npm install next-auth bcrypt

### downloading and updating the movies

1. Download the csv with all the movies here: https://api.watchmode.com/datasets/title_id_map.csv
2. Drag this csv file into src/data/
3. Then, in the w2w folder, run `node src/scripts/importCsv.js`

### connecting to the db to see tables

`psql postgres://dev:dev@localhost:5432/w2w-db`

## API Keys & Database Setup (What environment variables or external configurations are needed)
