const cors = require("cors");
const express = require("express");

const sequelize = require("./util/db");
const { Node, Link, Resource } = require("./models/index");

const app = express();
app.use(express.json());
app.use(cors());

// Called upon opening the graph from the homepage. Will eventually need to
// filter item visibility by score somehow - maybe this should be done by
// the client to avoid round-trip delay when using the score filter slider?
// (Also to avoid increasing server load with number of clients)
app.get("/", function getGraph(_, response) {
  Promise.all([
    Node.findAll().then((nodes) => {
      return nodes.map((node) => ({
        id: node.nodeId
      }));
    }),
    Link.findAll().then((links) => {
      return links.map((link) => ({
        id: link.id,
        source: link.sourceNodeId,
        target: link.targetNodeId,
      }));
    })
  ]).then(([nodes, links]) => {
    return response.json({ nodes, links }).status(200).end();
  });
});

// Called upon opening a NodeWindow. Returns node metadata.
app.get("/:nodeId", function getNodeWindow(request, response) {
  Node.findByPk(request.params.nodeId).then((node) => {
    return response.json(node).status(200).end();
  });
});

// Called upon selecting Resources within a NodeWindow.
app.get("/:nodeId/resources", function getNodeResources(request, response) {
  Resource.findAll({
    where: { nodeId: request.params.nodeId }
  }).then((resources) => {
    return response.json(resources).status(200).end();
  });
});

// Called upon selecting Inlinks within a NodeWindow.
app.get("/:nodeId/inlinks", function getNodeInlinks(request, response) {
  Link.findAll({
    where: { targetNodeId: request.params.nodeId }
  }).then((inlinks) => {
    return response.json(inlinks).status(200).end();
  });
});

// Called upon selecting Outlinks within a NodeWindow.
// TODO: merge GET endpoints for inlinks/outlinks
app.get("/:nodeId/outlinks", function getNodeOutlinks(request, response) {
  Link.findAll({
    where: { sourceNodeId: request.params.nodeId }
  }).then((outlinks) => {
    return response.json(outlinks).status(200).end();
  });
});

// Called upon posting a node vote.
app.post("/:nodeId/vote/:vote", function postNodeVote(request, response) {
  switch (request.params.vote) {
    case "upvote":
      Node.increment("score", { where: { nodeId: request.params.nodeId } })
        .then(() => { return response.status(200).end(); });
      break;
    case "downvote":
      Node.decrement("score", { where: { nodeId: request.params.nodeId } })
        .then(() => { return response.status(200).end(); });
      break;
    default:
      console.error("Received invalid vote");
      return response.status(400).end();
  }
});

// Called upon posting a resource.
app.post("/:nodeId/resource", function postResource(request, response) {
  Resource.create({
    resourceId: request.body.resourceId,
    nodeId: request.params.nodeId
  }).then(() => {
    return response.status(200).end();
  }).catch(() => {
    // TODO-medium: add proper error handling (switch statement)
    return response.status(400).end();
  });
});

// Called upon posting an inlink.
app.post("/:nodeId/inlink", function postInlink(request, response) {
  Link.create({
    sourceNodeId: request.body.sourceNodeId,
    targetNodeId: request.params.nodeId,
  }).then(() => {
    return response.status(200).end();
  }).catch((error) => {
    switch (error.parent.code) {
      case "23503":
        console.warn(`Attempted to add inlink with non-existent source
          ${request.body.sourceNodeId}`);
        return response.status(404).end();
      case "23505":
        console.warn("Attempted to add inlink that already exists");
        return response.status(400).end();
      default:
        console.log(`Failed to add link\n${error}`);
        break;
    }
  });
});

// Called upon posting an outlink.
// TODO: merge POST endpoints for inlinks/outlinks
app.post("/:nodeId/outlink", function outInlink(request, response) {
  Link.create({
    sourceNodeId: request.params.nodeId,
    targetNodeId: request.body.targetNodeId,
  }).then(() => {
    return response.status(200).end();
  }).catch((error) => {
    switch (error.parent.code) {
      case "23503":
        console.warn(`Attempted to add outlink with non-existent target
          ${request.body.sourceNodeId}`);
        return response.status(404).end();
      case "23505":
        console.warn("Attempted to add outlink that already exists");
        return response.status(400).end();
      default:
        console.log(`Failed to add link\n${error}`);
        break;
    }
  });
});

// DEBUG ONLY
app.delete("/", async function resetDatabase(_, response) {
  await Node.drop({ cascade: true });
  await Link.drop({ cascade: true });
  await Resource.drop({ cascade: true });
  await sequelize.sync({});

  await Node.bulkCreate([
    { nodeId: "Calculus-1" },
    { nodeId: "Calculus-2" }
  ]);

  await Link.create({
    sourceNodeId: "Calculus-1",
    targetNodeId: "Calculus-2"
  });

  await Resource.bulkCreate([
    {
      resourceId: "freeCodeCamp Calc 1 https://youtu.be/HfACrKJ_Y2w",
      nodeId: "Calculus-1"
    },
    {
      resourceId: "Prof. Leonard https://youtube.com/playlist?list=PLF797E961509B4EB5",
      nodeId: "Calculus-1"
    },
    {
      resourceId: "freeCodeCamp Calc 2 https://youtu.be/7gigNsz4Oe8",
      nodeId: "Calculus-2"
    },
    {
      resourceId: "other video [imagine URL here]",
      nodeId: "Calculus-2"
    },
  ]);

  return response.status(200).end();

});

const PORT = process.env.PORT || 3001;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
});