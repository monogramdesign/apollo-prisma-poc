// https://www.prisma.io/docs/guides/database/seed-database
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const categories = [
    {
      name: "Category 1",
    },
    {
      name: "Category 2",
    },
    {
      name: "Category 3",
    },
  ];

  await prisma.category.createMany({ data: categories });
  const createdCategories = await prisma.category.findMany();

  let products: {
    name: string;
    published: boolean;
    price: number;
    categoryId: number;
  }[] = [];
  for (let i = 1; i < 10; i++) {
    const random = Math.floor(Math.random() * createdCategories?.length);

    products.push({
      name: `Product ${i}`,
      published: true,
      price: i,
      categoryId: createdCategories[random].id,
    });
  }

  const productsPromise = prisma.product.createMany({ data: products });

  let users: {
    name: string;
    email: string;
  }[] = [];
  for (let i = 1; i < 10; i++) {
    users.push({
      name: `User ${i}`,
      email: `user${i}@mail.com`,
    });
  }

  const usersPromise = prisma.user.createMany({ data: users });

  await Promise.all([usersPromise, productsPromise]);

  // TODO seed orders
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
