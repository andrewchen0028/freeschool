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
  await User.create({
    data: {
      pubkey: "021eaf27a2cd3ac78398513479f2659edc5c6d7d520b7ae3286e88bda67950be62"
    }
  })
  await Node.createMany({
    data: [
      { id: 999991, title: "Calculus 1", userPubkey: "021eaf27a2cd3ac78398513479f2659edc5c6d7d520b7ae3286e88bda67950be62" },
      { id: 999992, title: "Calculus 2", userPubkey: "021eaf27a2cd3ac78398513479f2659edc5c6d7d520b7ae3286e88bda67950be62" },
      { id: 999995, title: "Calculus 3", userPubkey: "021eaf27a2cd3ac78398513479f2659edc5c6d7d520b7ae3286e88bda67950be62" },
      { id: 999996, title: "Differential Eqs", userPubkey: "021eaf27a2cd3ac78398513479f2659edc5c6d7d520b7ae3286e88bda67950be62" },
      { id: 999996, title: "Topology", userPubkey: "021eaf27a2cd3ac78398513479f2659edc5c6d7d520b7ae3286e88bda67950be62" },
      { id: 999993, title: "Continuity", userPubkey: "021eaf27a2cd3ac78398513479f2659edc5c6d7d520b7ae3286e88bda67950be62" },
      { id: 999994, title: "Limits", userPubkey: "021eaf27a2cd3ac78398513479f2659edc5c6d7d520b7ae3286e88bda67950be62" },
    ]
  });
  await Link.createMany({
    data: [
      { source: 999991, target: 999992 },
      { source: 999993, target: 999994 },
      { source: 999992, target: 999995 },
      { source: 999995, target: 999996 },
      { source: 999995, target: 999997 }
    ]
  });
  await Resource.createMany({
    data: [
      { id: 0, nodeId: 999991, url: "3blue1brown Calculus 1 https://www.youtube.com/watch?v=WUvTyaaNkzM" },
      { id: 1, nodeId: 999992, url: "Professor Leonard https://www.youtube.com/watch?v=H9eCT6f_Ftw&list=PLDesaqWTN6EQ2J4vgsN1HyBeRADEh4Cw-" },
      { id: 2, nodeId: 999993, url: "OChem Tutor on youtube https://www.youtube.com/watch?v=WT7oxiiFYt8" },
      { id: 3, nodeId: 999994, url: "Khan academy vid https://www.youtube.com/watch?v=riXcZT2ICjA" },
      { id: 5, nodeId: 999991, url: "freecodecamp calc 1 https://www.youtube.com/watch?v=HfACrKJ_Y2w&t=2s" },
    ]
  });
  await ResourceComment.createMany({
    data: [
      { id: 0, text: "In that particular situation - one trade - north of half a million dollars.", resourceId: 0 },
      { id: 1, text: "And I'd do that for anybody. \nAnybody, you know, that needs the proper guidance.", resourceId: 0, parentCommentId: 0 },
      { id: 2, text: "Can you say that again? Just the way you said it. Just the same way.", resourceId: 0, parentCommentId: 1 },
      { id: 3, text: "You didn't try to bribe the FBI agent, did you?", resourceId: 0 },
      { id: 4, text: "Did you ever hear the tragedy of Darth Plagueis The Wise? I thought not. It’s not a story the Jedi would tell you. It’s a Sith legend. Darth Plagueis was a Dark Lord of the Sith, so powerful and so wise he could use the Force to influence the midichlorians to create life… He had such a knowledge of the dark side that he could even keep the ones he cared about from dying. The dark side of the Force is a pathway to many abilities some consider to be unnatural.", resourceId: 5 },
      { id: 5, text: "He became so powerful… the only thing he was afraid of was losing his power, which eventually, of course, he did. Unfortunately, he taught his apprentice everything he knew, then his apprentice killed him in his sleep. Ironic. He could save others from death, but not himself.", resourceId: 5, parentCommentId: 4 },
      { id: 6, text: "Is it possible to learn this power?", resourceId: 5 },
      { id: 7, text: "Not from a Jedi.", resourceId: 5, parentCommentId: 6 }
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