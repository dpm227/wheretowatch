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
3. set `DATABASE_URL="postgres://dev:dev@localhost:5432/w2w-db` in .env
4. run db migrations `npx prisma migrate dev`

### connecting to the db to see tables

`psql postgres://dev:dev@localhost:5432/w2w-db`

## API Keys & Database Setup (What environment variables or external configurations are needed)
