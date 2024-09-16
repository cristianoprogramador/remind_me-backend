import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("admin", salt);

  await prisma.user.deleteMany({});

  await prisma.user.create({
    data: {
      name: "admin",
      email: "admin@email.com",
      role: "admin",
      password: hashedPassword,
    },
  });

  console.log("Admin user created");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
