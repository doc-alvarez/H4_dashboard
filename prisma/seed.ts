import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function seed() {
  const tincho = await db.users.create({
    data: {
      username: "tincho",
      // this is a hashed version of "twixrox"
      password: "franteamo8",
    },
  });
}

seed();
