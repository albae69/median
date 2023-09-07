import { PrismaClient } from '@prisma/client';

//  init prisma client
const prisma = new PrismaClient();

async function main() {
  // create dummy articles
  const post1 = await prisma.article.upsert({
    where: { title: 'title' },
    update: {},
    create: {
      title: 'title',
      body: 'body',
      description: 'description',
      published: false,
    },
  });
  const post2 = await prisma.article.upsert({
    where: { title: 'title 2' },
    update: {},
    create: {
      title: 'title 2',
      body: 'body 2',
      description: 'description 2',
      published: false,
    },
  });
  console.log({ post1, post2 });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
