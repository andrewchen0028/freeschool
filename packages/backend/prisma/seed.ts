import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const Node = prisma.node;
const Link = prisma.link;
const Resource = prisma.resource;
const User = prisma.user; // TODO-user: seed user
const Sublink = prisma.sublink;

async function main() {
  await Link.deleteMany();
  await Sublink.deleteMany();
  await Resource.deleteMany();
  await Node.deleteMany();

  await Node.createMany({
    data: [
      { id: 1, title: "Calculus 1" },
      { id: 2, title: "Calculus 2" },
      { id: 3, title: "Continuity" },
      { id: 4, title: "Limits" },
    ]
  });
  await Link.createMany({
    data: [
      { source: 1, target: 2 },
      { source: 3, target: 4 }
    ]
  });
  await Resource.createMany({
    data: [
      { nodeId: 1, url: "https://www.fbi.gov" },
      { nodeId: 2, url: "https://www.atf.gov" },
      { nodeId: 3, url: "https://www.nsa.gov" },
      { nodeId: 4, url: "https://www.cia.gov" },
    ]
  });
  await Sublink.createMany({
    data: [
      { superId: 1, subId: 3 },
      { superId: 1, subId: 4 },
    ]
  });
}

main().then(async () => {
  await prisma.$disconnect();
}).catch(async (err) => {
  console.error(err);
  await prisma.$disconnect();
  process.exit(1);
});