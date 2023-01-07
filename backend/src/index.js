const cors = require("cors");
const express = require("express");

const sequelize = require("./util/db");
const { Node, Link, Resource } = require("./models/index");

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", function getGraph(_, response) {
  Promise.all([
    Node.findAll({ logging: false }).then((nodes) => {
      return nodes.map((node) => ({
        id: node.nodeId
      }));
    }),
    Link.findAll({ logging: false }).then((links) => {
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

app.get("/:nodeId", function getNodeWindow(request, response) {
  Resource.findAll({
    where: { nodeId: request.params.nodeId },
    logging: false
  }).then((resources) => {
    return response.json(resources).status(200).end();
  });
});

// DEBUG ONLY
// TODO: implement error handling for duplicate resources within the same node
app.post("/:nodeId/resource", function postResource(request, response) {
  Resource.create({
    resourceId: "Resource-E",
    nodeId: request.params.nodeId
  }).then(() => {
    return response.status(200).end();
  });
});

// DEBUG ONLY
app.delete("/", async function resetDatabase(_, response) {
  await Node.drop({ cascade: true, logging: false });
  await Link.drop({ cascade: true, logging: false });
  await Resource.drop({ cascade: true, logging: false });
  await sequelize.sync({});

  await Node.bulkCreate([
    { nodeId: "Calculus-1" },
    { nodeId: "Calculus-2" }
  ], { logging: false });

  await Link.create({
    sourceNodeId: "Calculus-1",
    targetNodeId: "Calculus-2"
  }, { logging: false });

  await Resource.bulkCreate([
    { resourceId: "Resource-A", nodeId: "Calculus-1" },
    { resourceId: "Resource-B", nodeId: "Calculus-1" },
    { resourceId: "Resource-C", nodeId: "Calculus-2" },
    { resourceId: "Resource-D", nodeId: "Calculus-2" },
  ], { logging: false });

  return response.status(200).end();

});

const PORT = process.env.PORT || 3001;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
});