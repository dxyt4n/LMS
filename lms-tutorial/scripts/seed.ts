const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main() {
  try {
    await database.category.createMany({
      data: [
        { name: "Computer Science" },
        { name: "Music" },
        { name: "Fitness" },
        { name: "Photography" },
        { name: "Accounting" },
        { name: "Engineering" },
        { name: "Film" } 
      ],
    });

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding the database categories:", error);
  } finally {
    await database.$disconnect();
  }
}

main();
