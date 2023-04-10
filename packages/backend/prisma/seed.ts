import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const Node = prisma.node;
const Link = prisma.link;
const Resource = prisma.resource;
const User = prisma.user; // TODO-user: seed user
const Sublink = prisma.sublink;
const ResourceComment = prisma.resourceComment;

async function main() {
  await Link.deleteMany();
  await Sublink.deleteMany();
  await ResourceComment.deleteMany();
  await Resource.deleteMany();
  await Node.deleteMany();
  await User.deleteMany();

  // await User.createMany({
  //   data: [
  //     { id: 999991, username: "mycoal", email: "chen.michael.1116@gmail.com", passwordHash: }
  //   ]
  // });

  await Node.createMany({
    data: [
      { id: 999991, title: "Calculus 1" },
      { id: 999992, title: "Calculus 2" },
      { id: 999993, title: "Continuity" },
      { id: 999994, title: "Limits" },
    ]
  });
  await Link.createMany({
    data: [
      { source: 999991, target: 999992 },
      { source: 999993, target: 999994 }
    ]
  });
  await Resource.createMany({
    data: [
      { id: 0, nodeId: 999991, url: "https://www.fbi.gov" },
      { id: 1, nodeId: 999992, url: "https://www.atf.gov" },
      { id: 2, nodeId: 999993, url: "https://www.nsa.gov" },
      { id: 3, nodeId: 999994, url: "https://www.cia.gov" },
      { id: 5, nodeId: 999991, url: "https://www.dhs.gov" },
    ]
  });
  await ResourceComment.createMany({
    data: [
      { id: 0, text: "In that particular situation - one trade - north of half a million dollars.", resourceId: 0 },
      { id: 1, text: "And I'd do that for anybody. \nAnybody, you know, that needs the proper guidance.", resourceId: 0, parentCommentId: 0 },
      { id: 2, text: "Can you say that again? Just the way you said it. Just the same way.", resourceId: 0, parentCommentId: 1},
      { id: 3, text: "You didn't try to bribe the FBI agent, did you?", resourceId: 0},
      { id: 4, text: "Did you ever hear the tragedy of Darth Plagueis The Wise? I thought not. It’s not a story the Jedi would tell you. It’s a Sith legend. Darth Plagueis was a Dark Lord of the Sith, so powerful and so wise he could use the Force to influence the midichlorians to create life… He had such a knowledge of the dark side that he could even keep the ones he cared about from dying. The dark side of the Force is a pathway to many abilities some consider to be unnatural.", resourceId: 5 },
      { id: 5, text: "He became so powerful… the only thing he was afraid of was losing his power, which eventually, of course, he did. Unfortunately, he taught his apprentice everything he knew, then his apprentice killed him in his sleep. Ironic. He could save others from death, but not himself.", resourceId: 5, parentCommentId: 4 },
      { id: 6, text: "Is it possible to learn this power?", resourceId: 5},
      { id: 7, text: "Not from a Jedi.", resourceId: 5, parentCommentId: 6}
    ]
  })

  await Sublink.createMany({
    data: [
      { superId: 999991, subId: 999993 },
      { superId: 999991, subId: 999994 },
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