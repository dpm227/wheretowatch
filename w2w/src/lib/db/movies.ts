import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createTestMovie() {
  const movie = await prisma.movie.create({
    data: {
      title: "Test Movie",
      year: 2024,
    },
  });

  return movie;
}

createTestMovie();
