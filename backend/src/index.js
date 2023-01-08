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

// Called upon selecting Resources within a NodeWindow. Returns a list
// of resources for the given node.
app.get("/:nodeId/resources", function getNodeResources(request, response) {
  Resource.findAll({
    where: { nodeId: request.params.nodeId }
  }).then((resources) => {
    return response.json(resources).status(200).end();
  });
});

app.post("/:nodeId/resources", function postResource(request, response) {
  Resource.create({
    resourceId: request.body.resourceId,
    nodeId: request.params.nodeId
  }).then(() => {
    return response.status(200).end();
  }).catch(() => {
    return response.status(400).end();
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
    { resourceId: "Resource-A", nodeId: "Calculus-1" },
    { resourceId: "Resource-B", nodeId: "Calculus-1" },
    { resourceId: "Resource-C", nodeId: "Calculus-2" },
    { resourceId: "Resource-D", nodeId: "Calculus-2" },
  ]);

  return response.status(200).end();

});

const PORT = process.env.PORT || 3001;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
});