const cors = require("cors");
const express = require("express");

const prisma = require('./prisma');
const { PrismaClientKnownRequestError } = require("@prisma/client/runtime");
const Node = prisma.node;
const Link = prisma.link;
const Resource = prisma.resource;

const app = express();
app.use(express.json());
app.use(cors());

// TODO-medium: Update error handlers to use "error.name" instead of
//              "error.parent.code", which apparently doesn't exist on
//              all errors. Also add error messages (console.warn).

// Called upon opening the graph from the homepage. Returns nodes and links.
app.get("/", function getGraph(_, response) {
  Promise.all([
    Node.findMany(),
    Link.findMany()
  ]).then(([nodes, links]) => {
    return response.json({ nodes, links }).status(200).end();
  });
});

// TODO-current: broken by integer nodeId, fix
// Called upon opening a NodeWindow. Returns node metadata.
// (request.params.nodeId is of type string here, but needs to be int for db)
app.get("/:nodeId", function getNodeWindow(request, response) {
  Node.findUnique({
    where: { id: request.params.nodeId },
  }).then((node) => {
    return response.json(node).status(200).end();
  });
});

// TODO-current: probably broken by integer nodeId, fix
// Called upon selecting Resources within a NodeWindow.
app.get("/:nodeId/resources", function getNodeResources(request, response) {
  Resource.findMany({
    where: { nodeId: request.params.nodeId }
  }).then((resources) => {
    return response.json(resources).status(200).end();
  });
});

// TODO-current: probably broken by integer nodeId, fix
// Called upon selecting Inlinks within a NodeWindow.
app.get("/:nodeId/inlinks", function getNodeInlinks(request, response) {
  Link.findMany({
    where: { targetNodeId: request.params.nodeId }
  }).then((inlinks) => {
    return response.json(inlinks).status(200).end();
  });
});

// TODO-current: probably broken by integer nodeId, fix
// TODO-low: merge GET endpoints for inlinks/outlinks
// Called upon selecting Outlinks within a NodeWindow.
app.get("/:nodeId/outlinks", function getNodeOutlinks(request, response) {
  Link.findMany({
    where: { sourceNodeId: request.params.nodeId }
  }).then((outlinks) => {
    return response.json(outlinks).status(200).end();
  });
});

// TODO-current: probably broken by integer nodeId, fix
// Called upon posting a node.
app.post("/node", function postNode(request, response) {
  Node.create({
    data: {
      nodeId: request.body.nodeId
    }
  }).then(() => {
    return response.status(200).end();
  }).catch(
    /** @param {PrismaClientKnownRequestError} error */
    (error) => {
      // TODO-low: add error handling (e.g. duplicate node)
      console.warn(`Failed to add node ${request.body.nodeId}:\n${error}`);
      return response.status(500).end();
    });
});

// TODO-current: probably broken by integer nodeId, fix
// Called upon posting a node vote.
app.post("/:nodeId/vote/:vote", async function postNodeVote(request, response) {
  switch (request.params.vote) {
    case "upvote":
      await Node.update({
        data: { score: { increment: 1 } },
        where: { nodeId: request.params.nodeId }
      });
      return response.status(200).end();
    case "downvote":
      await Node.update({
        data: { score: { decrement: 1 } },
        where: { nodeId: request.params.nodeId }
      });
      return response.status(200).end();
    default:
      console.error("Received invalid vote");
      return response.status(400).end();
  }
});

// TODO-current: probably broken by integer nodeId, fix
// Called upon posting a resource.
app.post("/:nodeId/resource", function postResource(request, response) {
  Resource.create({
    data: {
      url: request.body.url,
      nodeId: request.params.nodeId
    }
  }).then(() => {
    return response.status(200).end();
  }).catch(/** @param {PrismaClientKnownRequestError} error */
    (error) => {
      switch (error.name) {
        case "SequelizeValidationError":
          console.warn(`Attempted to add resource with invalid URL:
          ${request.body.url}`);
          return response.status(400).end();
        case "SequelizeForeignKeyConstraintError":
          console.warn(`Attempted to add resource on non-existent node:
          ${request.params.nodeId}`);
          return response.status(404).end();
        case "SequelizeUniqueConstraintError":
          console.warn(`Attempted to add duplicate resource:
          ${request.body.url}`);
          return response.status(409).end();
        default:
          console.warn(`Failed to add resource ${request.body.url}:
          \n${error}`);
          return response.status(500).end();
      }
    });
});

// TODO-current: probably broken by integer nodeId, fix
// Called upon posting an inlink.
app.post("/:nodeId/inlink", function postInlink(request, response) {
  Link.create({
    data: {
      sourceNodeId: request.body.sourceNodeId,
      targetNodeId: request.params.nodeId,
    }
  }).then(() => {
    return response.status(200).end();
  }).catch(/** @param {PrismaClientKnownRequestError} error */
    (error) => {
      switch (error.code) {
        case "P2003":
          console.warn(`Attempted to add inlink with non-existent source
          ${request.body.sourceNodeId}`);
          return response.status(404).end();
        case "P2002":
          console.warn(`Attempted to add duplicate inlink`);
          return response.status(409).end();
        default:
          console.warn(`Failed to add link\n${error}`);
          break;
      }
    });
});

// TODO-current: probably broken by integer nodeId, fix
// TODO-low: merge POST endpoints for inlinks/outlinks
// Called upon posting an outlink.
app.post("/:nodeId/outlink", function outInlink(request, response) {
  Link.create({
    data: {
      sourceNodeId: request.params.nodeId,
      targetNodeId: request.body.targetNodeId,
    }
  }).then(() => {
    return response.status(200).end();
  }).catch(/** @param {PrismaClientKnownRequestError} error */
    (error) => {
      switch (error.code) {
        case "P2003":
          console.warn(`Attempted to add outlink with non-existent target
          ${request.body.sourceNodeId}`);
          return response.status(404).end();
        case "P2002":
          console.warn(`Attempted to add duplicate outlink`);
          return response.status(409).end();
        default:
          console.warn(`Failed to add link\n${error}`);
          break;
      }
    });
});

// DEBUG ONLY
app.delete("/", async function resetDatabase(_, response) {

  // Had to change order to keep referential integrity - would be better if we could set "cascade: true" here
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

  // TODO-current: probably broken by integer nodeId, fix
  // await Resource.createMany({
  //   data: [
  //     { nodeId: "Calculus-1", url: "https://www.fbi.gov" },
  //     { nodeId: "Calculus-1", url: "https://www.atf.gov" },
  //     { nodeId: "Calculus-2", url: "https://www.nsa.gov" },
  //     { nodeId: "Calculus-2", url: "https://www.cia.gov" },
  //   ]
  // });

  return response.status(200).end();
}
);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});