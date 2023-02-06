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

// Graphs
app.get("/:nodeTitle", async function getGraphData(req, res) {
  // Find supernode
  let supernode = await Node.findUnique({ where: { title: req.params.nodeTitle } });
  if (!supernode) return res.status(500)
    .send(`getGraph(): Supernode ${req.params.nodeTitle} not found`).end();

  // Find subnodes
  let nodes = await Node.findMany({
    where: { subNodeIdToNode: { some: { superId: supernode.id } } }
  });
  if (!nodes.length) return res.status(204).end();


  // Find links
  let links = await Link.findMany({
    where: {
      OR: [
        { source: { in: nodes.map(node => node.id) } },
        { target: { in: nodes.map(node => node.id) } },
      ]
    }
  });
  if (!links.length) return res.status(500)
    .send(`getGraph() failed to find links`).end();

  // Return graph data
  return res.json({ nodes, links }).status(200).end();
});

// NodeWindows
app.get("/:nodeTitle/node", function getNodeData(req, res) {
  Node.findUnique({
    where: { title: req.params.nodeTitle },
  }).then((node) => {
    return res.json(node).status(200).end();
  }).catch((error) => {
    console.warn(`Failed to get node: ${error}`);
    return res.status(500).end();
  });
});

app.get("/:nodeTitle/resources", function getNodeResources(req, res) {
  Resource.findMany({
    where: { node: { title: req.params.nodeTitle } }
  }).then((resources) => {
    return res.json(resources).status(200).end();
  }).catch((error) => {
    console.warn(`Failed to get resources: ${error}`);
    return res.status(500).end();
  });
});

app.get("/:nodeTitle/inlinks", function getInlinks(req, res) {
  Link.findMany({
    where: { targetNode: { title: req.params.nodeTitle } },
    select: { sourceNode: true }
  }).then((sourceNodes) => {
    return res.json(sourceNodes.map(({ sourceNode }) => sourceNode))
      .status(200).end();
  }).catch((error) => {
    console.warn(`Failed to get inlinks: ${error}`);
    return res.status(500).send(error).end();
  });
});

app.get("/:nodeTitle/outlinks", function getOutlinks(req, res) {
  Link.findMany({
    where: { sourceNode: { title: req.params.nodeTitle } },
    select: { targetNode: true }
  }).then((targetNodes) => {
    return res.json(targetNodes.map(({ targetNode }) => targetNode))
      .status(200).end();
  }).catch((error) => {
    console.warn(`Failed to get outlinks: ${error}`);
    return res.status(500).send(error).end();
  });
});

// Users
app.get("/user", (_, res) => {
  User.findMany().then((users) => {
    return res.json(users).status(200).end();
  });
});


app.post("/node", function postNode(req, res) {
  Node.create({ data: { title: req.body.title } }).then((node) => {
    return res.json(node).status(200).end();
  }).catch((error) => {
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


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});