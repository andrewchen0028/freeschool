import { PrismaClient } from "@prisma/client";
import cors from "cors";
import express, { response } from "express";

const prisma = new PrismaClient();

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", function getGraph(_req, res) {
  Promise.all([
    prisma.node.findMany(),
    prisma.link.findMany()
  ]).then(([nodes, links]) => {
    return res.json({ nodes, links }).status(200).end();
  }).catch((error) => {
    console.warn(`Failed to get graph: ${error}`);
    return res.status(500).end();
  });
});

app.post("/node", function postNode(req, res) {
  prisma.node.create({
    data: { title: req.body.title }
  }).then((node) => {
    return res.json(node).status(200).end();
  }).catch((error) => {
    console.warn(`Failed to post node ${req.body.title}: ${error}`);
    return res.status(500).end();
  });
});

app.post("/", async (_req, res) => {
  // Order fixed for referential integrity
  await prisma.link.deleteMany();
  await prisma.node.deleteMany();

  await prisma.node.createMany({
    data: [
      { id: 0, title: "Calculus 1" },
      { id: 1, title: "Calculus 2" }
    ]
  });

  await prisma.link.create({ data: { id: 0, source: 0, target: 1 } });

  return res.status(200).end();
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});