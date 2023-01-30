import bcrypt from 'bcrypt';
import cors from "cors";
import express from "express";
import { PrismaClient } from '@prisma/client';

const app = express();
app.use(express.json());
app.use(cors());

const prisma = new PrismaClient();
const Node = prisma.node;
const Link = prisma.link;
const Resource = prisma.resource;
const User = prisma.user;

app.get("/", function getGraph(_, res) {
  Promise.all([
    Node.findMany(),
    Link.findMany()
  ]).then(([nodes, links]) => {
    return res.json({ nodes, links }).status(200).end();
  }).catch((error) => {
    console.warn(`Failed to get graph: ${error}`);
    return res.status(500).end();
  });
});

app.get("/:nodeId", function getNodeWindow(req, res) {
  Node.findUnique({
    where: { id: parseInt(req.params.nodeId) },
  }).then((node) => {
    return res.json(node).status(200).end();
  }).catch((error) => {
    console.warn(`Failed to get node: ${error}`);
    return res.status(500).end();
  });
});

app.get("/:nodeId/resources", function getNodeResources(req, res) {
  Resource.findMany({
    where: { nodeId: parseInt(req.params.nodeId) }
  }).then((resources) => {
    return res.json(resources).status(200).end();
  }).catch((error) => {
    console.warn(`Failed to get resources: ${error}`);
    return res.status(500).end();
  });
});

app.get("/:nodeId/inlinks", function getInlinks(req, res) {
  Link.findMany({
    where: { target: parseInt(req.params.nodeId) },
    select: { sourceNode: true }
  })
    .then(sourceNodes => res.json(sourceNodes.map(({ sourceNode }) => sourceNode)).status(200).end())
    .catch(error => res.status(500).send(error).end());
});

app.get("/:nodeId/outlinks", function getOutlinks(req, res) {
  Link.findMany({
    where: { source: parseInt(req.params.nodeId) },
    select: { targetNode: true }
  })
    .then(targetNodes => res.json(targetNodes.map(({ targetNode }) => targetNode)).status(200).end())
    .catch(error => res.status(500).send(error).end());
});

app.get("/user", (_, res) => {
  User.findMany().then((users) => {
    return res.json(users).status(200).end();
  });
});

app.post("/node", function postNode(req, res) {
  Node.create({ data: { title: req.body.title } }).then((node) => {
    return res.json(node).status(200).end();
  }).catch(
    (error) => {
      console.log(typeof (error));
      switch (error.code) {
        case "P2002":
          console.warn(`Attempted to add duplicate node: ${req.body.title}`);
          return res.status(409).end();
        default:
          console.warn(`Failed to add node ${req.body.title}: ${error}`);
          return res.status(500).end();
      }
    });
});

app.post("/:nodeId/vote/:vote", function postNodeVote(req, res) {
  switch (req.params.vote) {
    case "upvote":
      Node.update({
        data: { score: { increment: 1 } },
        where: { id: parseInt(req.params.nodeId) }
      }).then(() => { return res.status(200).end(); });
    case "downvote":
      Node.update({
        data: { score: { decrement: 1 } },
        where: { id: parseInt(req.params.nodeId) }
      }).then(() => { return res.status(200).end(); });
    default:
      console.error("Received invalid vote");
      return res.status(400).end();
  }
});

app.post("/:nodeId/resource", function postResource(req, res) {
  Resource.create({
    data: {
      url: req.body.url,
      node: { connect: { id: parseInt(req.params.nodeId) } }
    }
  }).then(() => {
    return res.status(200).end();
  }).catch(
    (error) => {
      console.log(typeof (error));
      switch (error.code) {
        case "P2002":
          console.warn(`Attempted to add duplicate resource: ${req.body.url}`);
          return res.status(409).end();
        default:
          console.warn(`Failed to add resource ${req.body.url}: ${error}`);
          return res.status(500).end();
      }
    });
});

app.post("/:nodeId/inlink", function postInlink(req, res) {
  Node.findUnique({
    where: { title: req.body.sourceNodeTitle }
  }).then((sourceNode) => {
    if (sourceNode) {
      Link.create({
        data: {
          sourceNode: { connect: { id: sourceNode.id } },
          targetNode: { connect: { id: parseInt(req.params.nodeId) } }
        }
      }).then((inlink) => {
        return res.json(inlink).status(200).end();
      }).catch(
        (error) => {
          console.log(typeof (error));
          console.warn(`Failed to post inlink: ${error}`);
          return res.status(500).end();
        });
    } else {
      console.log(`Failed to find node ${sourceNode}`);
      return res.status(500).end();
    }
  }).catch((error) => {
    console.log(typeof (error));
    console.log(`Failed to post inlink: ${error}`);
    return res.status(500).end();
  });
});

app.post("/:nodeId/outlink", function postOutlink(req, res) {
  Node.findUnique({
    where: { title: req.body.targetNodeTitle }
  }).then((targetNode) => {
    if (targetNode) {

      Link.create({
        data: {
          sourceNode: { connect: { id: parseInt(req.params.nodeId) } },
          targetNode: { connect: { id: targetNode.id } }
        }
      }).then((outlink) => {
        return res.json(outlink).status(200).end();
      }).catch(
        (error) => {
          console.log(typeof (error));
          console.warn(error);
          return res.status(500).end();
        });
    } else {
      console.log(`Failed to find node ${targetNode}`);
      return res.status(500).end();
    }
  }).catch((error) => {
    console.log(typeof (error));
    console.log(`Failed to post outlink: ${error}`);
    return res.status(500).end();
  })
});

app.post('/user', async (req, res) => {
  const { username, password } = req.body;

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  User.create({
    data: { username: username, passwordHash: passwordHash }
  }).then((user) => {
    return res.json(user).status(201).end();
  }).catch((error) => {
    console.log(typeof (error));
    switch (error.code) {
      case "P2002":
        console.warn(`Attempted to add duplicate username: ${username}`);
        return res.status(409).end();
      default:
        console.warn(`Failed to add user: ${error}`);
        return res.status(500).end();
    }
  });

});

// DEBUG ONLY
app.delete("/", async function resetDatabase(_, res) {
  // Had to change order to keep referential integrity - would be better if we set "cascade: true" here
  await Link.deleteMany();
  await Resource.deleteMany();
  await Node.deleteMany();

  await Node.createMany({
    data: [
      { id: 0, title: "Calculus 1" },
      { id: 1, title: "Calculus 2" },
    ]
  });
  await Link.create({ data: { id: 0, source: 0, target: 1 } });
  await Resource.createMany({
    data: [
      { nodeId: 0, url: "https://www.fbi.gov" },
      { nodeId: 0, url: "https://www.atf.gov" },
      { nodeId: 1, url: "https://www.nsa.gov" },
      { nodeId: 1, url: "https://www.cia.gov" },
    ]
  });
  return res.status(200).end();
}
);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});